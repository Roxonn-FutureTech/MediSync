from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate
from ..services.auth_service import AuthService
from ..services.email_service import EmailService
from ..models.user import User, Role, AuditLog, db
import jwt
from datetime import datetime, timedelta

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Schemas
class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    password = fields.Str(required=True, validate=validate.Length(min=8))
    role = fields.Str(required=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    two_factor_token = fields.Str(required=False)

class AuditLogSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int()
    action = fields.Str()
    details = fields.Str()
    ip_address = fields.Str()
    timestamp = fields.DateTime()

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    try:
        schema = RegisterSchema()
        data = schema.load(request.json)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Verify role exists
        role = Role.query.filter_by(name=data['role']).first()
        if not role:
            return jsonify({'error': 'Invalid role specified'}), 400
            
        # Create new user
        user = User(
            email=data['email'],
            username=data['username']
        )
        user.set_password(data['password'])
        user.roles.append(role)  # Use the roles relationship
        
        db.session.add(user)
        db.session.commit()
        
        # Log the registration
        AuthService.log_audit(
            user.id,
            'REGISTER',
            'User registered successfully',
            request.remote_addr
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'roles': [role.name for role in user.roles]
            }
        }), 201
    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'An error occurred during registration'}), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    try:
        schema = LoginSchema()
        data = schema.load(request.json)
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check 2FA if enabled
        if user.two_factor_enabled:
            if not data.get('two_factor_token'):
                return jsonify({
                    'message': '2FA token required',
                    'requires_2fa': True
                }), 200
                
            if not AuthService.verify_2fa_token(user.two_factor_secret, data['two_factor_token']):
                return jsonify({'error': 'Invalid 2FA token'}), 401
        
        # Generate tokens
        tokens = AuthService.create_tokens(user.id)
        
        # Update login info
        AuthService.update_login_info(user, request.remote_addr)
        
        # Log the login
        AuthService.log_audit(
            user.id,
            'LOGIN',
            'User logged in successfully',
            request.remote_addr
        )
        
        return jsonify(tokens), 200
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'An error occurred during login'}), 500

@auth_bp.route('/2fa/enable', methods=['POST'])
@jwt_required()
@limiter.limit("3 per minute")
def enable_2fa():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        if user.two_factor_enabled:
            return jsonify({'error': '2FA is already enabled'}), 400
        
        secret = AuthService.generate_2fa_secret()
        user.two_factor_secret = secret
        user.two_factor_enabled = True
        db.session.commit()
        
        AuthService.log_audit(
            user.id,
            '2FA_ENABLE',
            '2FA was enabled for user',
            request.remote_addr
        )
        
        return jsonify({
            'secret': secret,
            'message': '2FA enabled successfully'
        }), 200
    except Exception as e:
        current_app.logger.error(f"2FA enable error: {str(e)}")
        return jsonify({'error': 'An error occurred while enabling 2FA'}), 500

@auth_bp.route('/password/reset/request', methods=['POST'])
@limiter.limit("3 per minute")
def request_password_reset():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        try:
            token = AuthService.generate_password_reset_token(user)
            EmailService.send_password_reset_email(user.email, token)
            
            AuthService.log_audit(
                user.id,
                'PASSWORD_RESET_REQUEST',
                'Password reset was requested',
                request.remote_addr
            )
            
            return jsonify({
                'message': 'Password reset instructions have been sent to your email'
            }), 200
        except Exception as e:
            current_app.logger.error(f"Password reset error: {str(e)}")
            return jsonify({
                'error': 'Unable to process password reset request. Please try again later.'
            }), 500
    
    # Don't reveal whether the email exists
    return jsonify({
        'message': 'If the email exists, reset instructions will be sent'
    }), 200

@auth_bp.route('/password/reset/verify', methods=['POST'])
@limiter.limit("3 per minute")
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('new_password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400
    
    user = AuthService.verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    user.set_password(new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    db.session.commit()
    
    AuthService.log_audit(
        user.id,
        'PASSWORD_RESET',
        'Password was reset successfully',
        request.remote_addr
    )
    
    return jsonify({'message': 'Password reset successful'}), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@limiter.limit("10 per minute")
def refresh_token():
    try:
        # Get new tokens
        tokens = AuthService.create_tokens(get_jwt_identity())
        return jsonify(tokens), 200
    except Exception as e:
        current_app.logger.error(f"Refresh token error: {str(e)}")
        return jsonify({'error': 'An error occurred during token refresh'}), 500

@auth_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@limiter.limit("10 per minute")
def get_audit_logs():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Get audit logs for the user
        logs = AuditLog.query.filter_by(user_id=user.id).order_by(AuditLog.timestamp.desc()).all()
        
        return jsonify([{
            'id': log.id,
            'action': log.action,
            'details': log.details,
            'ip_address': log.ip_address,
            'timestamp': log.timestamp.isoformat()
        } for log in logs]), 200
    except Exception as e:
        current_app.logger.error(f"Audit logs error: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching audit logs'}), 500

@auth_bp.route('/audit-logs/actions', methods=['GET'])
@jwt_required()
def get_audit_log_actions():
    """Get list of possible audit log actions."""
    actions = [
        'REGISTER',
        'LOGIN',
        '2FA_ENABLE',
        'PASSWORD_RESET_REQUEST',
        'PASSWORD_RESET',
        'PROFILE_UPDATE'
    ]
    return jsonify(actions), 200

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({
        'message': 'Authentication server is running',
        'status': 'OK'
    }), 200 