from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate
from ..services.auth_service import AuthService
from ..services.email_service import EmailService
from ..models.user import User, AuditLog, db
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3))
    password = fields.Str(required=True, validate=validate.Length(min=8))

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
def register():
    try:
        schema = RegisterSchema()
        data = schema.load(request.json)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
            
        # Create new user
        user = User(
            email=data['email'],
            username=data['username'],
            active=True
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'email': user.email,
                'username': user.username
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/debug/users', methods=['GET'])
def debug_users():
    """Debug endpoint to list all users. REMOVE IN PRODUCTION."""
    if not current_app.debug:
        return jsonify({'error': 'Not available in production'}), 403
    
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'active': user.active,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'last_login_at': user.last_login_at.isoformat() if user.last_login_at else None
    } for user in users]
    
    return jsonify({
        'user_count': len(user_list),
        'users': user_list
    }), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt with data:", data)  # Debug print
        
        user = User.query.filter_by(email=data['email']).first()
        print("Found user:", user)  # Debug print
        
        if not user or not user.check_password(data['password']):
            print("Invalid credentials")  # Debug print
            return jsonify({'error': 'Invalid email or password'}), 401
        
        print("Password check passed")  # Debug print
        
        # Generate tokens
        access_token = jwt.encode(
            {
                'user_id': user.id,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(hours=1)
            },
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        
        refresh_token = jwt.encode(
            {
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(days=30)
            },
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        
        print("Tokens generated successfully")  # Debug print
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
    except Exception as e:
        print("Login error:", str(e))  # Debug print
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/2fa/enable', methods=['POST'])
@jwt_required()
def enable_2fa():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
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

@auth_bp.route('/password/reset/request', methods=['POST'])
def request_password_reset():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        try:
            token = AuthService.generate_password_reset_token(user)
            EmailService.send_password_reset_email(user.email, token)
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
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('new_password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400
    
    user = AuthService.verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    user.password = AuthService.hash_password(new_password)
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

@auth_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
def get_audit_logs():
    """Get audit logs for the current user."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters for filtering
    action = request.args.get('action')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Base query
    query = AuditLog.query.filter_by(user_id=user_id)
    
    # Apply filters if provided
    if action:
        query = query.filter_by(action=action)
    if start_date:
        query = query.filter(AuditLog.timestamp >= start_date)
    if end_date:
        query = query.filter(AuditLog.timestamp <= end_date)
    
    # Order by timestamp descending (most recent first)
    logs = query.order_by(AuditLog.timestamp.desc()).all()
    
    # Serialize the logs
    schema = AuditLogSchema(many=True)
    return jsonify(schema.dump(logs)), 200

@auth_bp.route('/audit-logs/actions', methods=['GET'])
@jwt_required()
def get_audit_log_actions():
    """Get list of possible audit log actions."""
    actions = [
        'REGISTER',
        'LOGIN',
        '2FA_ENABLE',
        'PASSWORD_RESET',
        # Add any other actions here
    ]
    return jsonify(actions), 200

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({
        'message': 'Authentication server is running',
        'status': 'OK'
    }), 200 