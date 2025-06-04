"""MediSync API application module.

This module contains the main Flask application setup, route definitions,
security configurations, and error handlers for the MediSync API.
"""

from flask import Flask, jsonify, request, send_from_directory, session, abort, redirect, url_for, flash
from datetime import datetime, timezone
from marshmallow import ValidationError
import os
import secrets
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from src.api.utils.encryption import EncryptedField
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_talisman import Talisman

# Initialize Flask app
app = Flask(__name__)

# Security Configuration
if os.getenv('FLASK_ENV') == 'production':
    secret = os.getenv('SECRET_KEY')
    if not secret:
        raise RuntimeError("SECRET_KEY must be set in production environment")
else:
    secret = os.getenv('SECRET_KEY', os.urandom(32).hex())
app.config['SECRET_KEY'] = secret

# Initialize security extensions
Talisman(app, 
    force_https=True,
    strict_transport_security=True,
    session_cookie_secure=True,
    content_security_policy={
        'default-src': "'self'",
        'script-src': "'self'",
        'style-src': "'self'",
    }
)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///./emergency_portal.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'simple'  # Use simple cache for development
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes
app.config['DOCS_PATH'] = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'

# Initialize extensions
db = SQLAlchemy()
db.init_app(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
cache = Cache(app)

# Import models and other modules after extensions are initialized
from .models import User, Hospital
from .schemas import HospitalSchema, ErrorSchema
from .middleware.security import init_security_middleware, require_ssl, validate_content_type, audit_log

# Initialize security middleware
init_security_middleware(app)

# Initialize Admin interface (after all models are loaded)
from .admin import init_admin
admin = init_admin(app)

# CSRF Protection for web routes
def generate_csrf_token():
    """Generate a new CSRF token or return existing one from session."""
    if '_csrf_token' not in session:
        session['_csrf_token'] = secrets.token_hex(32)
    return session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generate_csrf_token

@app.before_request
def validate_json():
    """Validate JSON content before processing the request."""
    if request.method in ['POST', 'PUT', 'PATCH']:
        if request.headers.get('Content-Type') == 'application/json':
            try:
                if not request.get_json(silent=True):
                    abort(400, description="Invalid or empty JSON")
            except Exception as e:
                abort(400, description=str(e))

@app.before_request
def csrf_protect():
    """Protect against CSRF attacks by validating token."""
    if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
        token = None
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            token = request.headers.get('X-CSRF-Token')
        else:
            token = request.form.get('_csrf_token')
        
        if not token or token != session.get('_csrf_token'):
            abort(403, description="CSRF token validation failed")

@app.before_request
def parse_json_request():
    """Parse and validate JSON request data."""
    if request.is_json:
        try:
            request.json
        except Exception as e:
            return jsonify({
                'error': 'Invalid JSON',
                'message': str(e),
                'status_code': 400
            }), 400

# Error handlers
@app.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify({
        'error': 'Validation Error',
        'message': error.messages,
        'status_code': 400
    }), 400

@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found',
        'status_code': 404
    }), 404

@app.errorhandler(429)
def handle_rate_limit_exceeded(error):
    return jsonify({
        'error': 'Rate Limit Exceeded',
        'message': 'Too many requests',
        'status_code': 429
    }), 429

# Routes with security decorators
@app.route('/')
@require_ssl
def index():
    return jsonify({
        "name": "MediSync API",
        "version": "1.0.0",
        "description": "Emergency Medical Services Portal API",
        "endpoints": {
            "health_check": "/health",
            "hospitals": {
                "list": "/api/hospitals",
                "get": "/api/hospitals/{id}",
                "create": "/api/hospitals",
                "update": "/api/hospitals/{id}",
                "delete": "/api/hospitals/{id}"
            }
        },
        "documentation": "/docs"
    }), 200

@app.route('/health')
@cache.cached(timeout=60)
@require_ssl
def health_check():
    return jsonify({"status": "OK"}), 200

@app.route('/api/hospitals', methods=['POST'])
@require_ssl
@validate_content_type
@limiter.limit("10 per minute")
@audit_log('hospital_creation')
def register_hospital():
    """Register a new hospital in the system.
    
    Returns:
        tuple: JSON response and status code
    """
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({
                'error': 'Invalid JSON',
                'message': 'No JSON data provided',
                'status_code': 400
            }), 400
        
        schema = HospitalSchema()
        data = schema.load(json_data)
        new_hospital = Hospital(
            name=data['name'],
            address=data['address'],
            phone=data['phone'],
            capacity=data['capacity']
        )
        db.session.add(new_hospital)
        db.session.commit()
        return jsonify(schema.dump(new_hospital)), 201
    except ValidationError as e:
        return jsonify({
            'error': 'Validation Error',
            'message': e.messages,
            'status_code': 400
        }), 400
    except Exception as e:
        app.logger.error("Error in register_hospital: %s", str(e))
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500

@app.route('/api/hospitals', methods=['GET'])
@require_ssl
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
@audit_log('hospitals_list')
def get_hospitals():
    hospitals = Hospital.query.all()
    schema = HospitalSchema(many=True)
    return jsonify(schema.dump(hospitals)), 200

@app.route('/api/hospitals/<int:hospital_id>', methods=['GET'])
@require_ssl
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
@audit_log('hospital_view')
def get_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    schema = HospitalSchema()
    return jsonify(schema.dump(hospital)), 200

@app.route('/api/hospitals/<int:hospital_id>', methods=['PUT'])
@require_ssl
@validate_content_type
@limiter.limit("10 per minute")
@audit_log('hospital_update')
def update_hospital(hospital_id):
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({
                'error': 'Invalid JSON',
                'message': 'No JSON data provided',
                'status_code': 400
            }), 400
        
        hospital = Hospital.query.get_or_404(hospital_id)
        schema = HospitalSchema()
        data = schema.load(json_data)
        
        hospital.name = data['name']
        hospital.address = data['address']
        hospital.phone = data['phone']
        hospital.capacity = data['capacity']
        db.session.commit()
        return jsonify(schema.dump(hospital)), 200
    except ValidationError as e:
        return jsonify({
            'error': 'Validation Error',
            'message': e.messages,
            'status_code': 400
        }), 400
    except Exception as e:
        app.logger.error(f"Error in update_hospital: {str(e)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An error occurred while processing your request',
            'status_code': 500
        }), 500

@app.route('/api/hospitals/<int:hospital_id>', methods=['DELETE'])
@require_ssl
@limiter.limit("10 per minute")
@audit_log('hospital_deletion')
def delete_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    db.session.delete(hospital)
    db.session.commit()
    return '', 204

@app.route('/docs')
@require_ssl
@cache.cached(timeout=300)
def docs():
    try:
        with open(os.path.join(app.config['DOCS_PATH'], 'API.md'), 'r') as f:
            content = f.read()
            return content, 200, {'Content-Type': 'text/markdown'}
    except FileNotFoundError:
        return jsonify({
            'error': 'Documentation Not Found',
            'message': 'The API documentation is currently unavailable',
            'status_code': 404
        }), 404

# Add CSRF token header to all responses
@app.after_request
def add_csrf_token(response):
    if '_csrf_token' not in session:
        session['_csrf_token'] = secrets.token_hex(32)
    response.headers['X-CSRF-Token'] = session['_csrf_token']
    return response

# Authentication routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username_or_email = request.form.get('username')
        password = request.form.get('password')
        
        if not username_or_email or not password:
            flash('Please provide both username/email and password', 'error')
            return f'''
                <!DOCTYPE html>
                <html>
                <head>
                    <title>MediSync Login</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }}
                        .login-container {{
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            width: 400px;
                        }}
                        h1 {{
                            text-align: center;
                            color: #333;
                            margin-bottom: 30px;
                        }}
                        .form-group {{
                            margin-bottom: 20px;
                        }}
                        input[type="text"],
                        input[type="password"] {{
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }}
                        input[type="submit"] {{
                            width: 100%;
                            padding: 12px;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }}
                        input[type="submit"]:hover {{
                            background-color: #45a049;
                        }}
                        .error {{
                            color: #ff0000;
                            text-align: center;
                            margin-top: 10px;
                        }}
                        .demo-accounts {{
                            margin-top: 20px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        }}
                        .tab-buttons {{
                            display: flex;
                            border-bottom: 1px solid #ddd;
                        }}
                        .tab-button {{
                            flex: 1;
                            padding: 10px;
                            border: none;
                            background: none;
                            cursor: pointer;
                            font-size: 14px;
                            color: #666;
                        }}
                        .tab-button.active {{
                            background-color: #f8f8f8;
                            border-bottom: 2px solid #4CAF50;
                            color: #333;
                        }}
                        .tab-content {{
                            display: none;
                            padding: 15px;
                            background-color: #f8f8f8;
                        }}
                        .tab-content.active {{
                            display: block;
                        }}
                        .account-info {{
                            margin: 5px 0;
                            font-size: 0.9em;
                        }}
                        .use-credentials {{
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.9em;
                            margin-top: 10px;
                        }}
                        .use-credentials:hover {{
                            background-color: #45a049;
                        }}
                    </style>
                </head>
                <body>
                    <div class="login-container">
                        <h1>MediSync Login</h1>
                        <form method="post" id="loginForm">
                            <div class="form-group">
                                <input type="text" name="username" id="username" placeholder="Username or Email" value="admin">
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" id="password" placeholder="Password" value="admin123">
                            </div>
                            <input type="submit" value="Login">
                            <div class="error">Please provide both username/email and password</div>
                        </form>
                        
                        <div class="demo-accounts">
                            <div class="tab-buttons">
                                <button class="tab-button active" onclick="showTab('admin')">Admin Account</button>
                                <button class="tab-button" onclick="showTab('doctor')">Doctor Account</button>
                                <button class="tab-button" onclick="showTab('nurse')">Nurse Account</button>
                            </div>
                            
                            <div id="admin" class="tab-content active">
                                <div class="account-info">Username: admin</div>
                                <div class="account-info">Password: admin123</div>
                                <div class="account-info">Role: Administrator</div>
                                <button class="use-credentials" onclick="useCredentials('admin', 'admin123')">Use These Credentials</button>
                            </div>
                            
                            <div id="doctor" class="tab-content">
                                <div class="account-info">Username: doctor</div>
                                <div class="account-info">Password: doctor123</div>
                                <div class="account-info">Role: Doctor</div>
                                <button class="use-credentials" onclick="useCredentials('doctor', 'doctor123')">Use These Credentials</button>
                            </div>
                            
                            <div id="nurse" class="tab-content">
                                <div class="account-info">Username: nurse</div>
                                <div class="account-info">Password: nurse123</div>
                                <div class="account-info">Role: Nurse</div>
                                <button class="use-credentials" onclick="useCredentials('nurse', 'nurse123')">Use These Credentials</button>
                            </div>
                        </div>
                    </div>
                    
                    <script>
                        function showTab(tabId) {{
                            // Hide all tabs
                            document.querySelectorAll('.tab-content').forEach(tab => {{
                                tab.classList.remove('active');
                            }});
                            document.querySelectorAll('.tab-button').forEach(button => {{
                                button.classList.remove('active');
                            }});
                            
                            // Show selected tab
                            document.getElementById(tabId).classList.add('active');
                            document.querySelector(`[onclick="showTab('${{tabId}}')"]`).classList.add('active');
                        }}
                        
                        function useCredentials(username, password) {{
                            document.getElementById('username').value = username;
                            document.getElementById('password').value = password;
                        }}
                    </script>
                </body>
                </html>
            '''.format("Please provide both username/email and password")
        
        # Try to find user by username or email
        try:
            user = User.query.filter(
                (User.username == username_or_email) | 
                (User.email == username_or_email)
            ).first()
            
            app.logger.info(f"Login attempt for user: {username_or_email}")
            
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                app.logger.info(f"Successful login for user: {user.username}")
                return redirect(url_for('admin.index'))
            
            app.logger.warning(f"Failed login attempt for: {username_or_email}")
            flash('Invalid username/email or password', 'error')
            
        except Exception as e:
            app.logger.error(f"Error during login: {str(e)}")
            flash('An error occurred during login. Please try again.', 'error')
    
    error_message = request.args.get('error', '')
    return f'''
        <!DOCTYPE html>
        <html>
        <head>
            <title>MediSync Admin Login</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }}
                .login-container {{
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 400px;
                }}
                h1 {{
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }}
                .form-group {{
                    margin-bottom: 20px;
                }}
                input[type="text"],
                input[type="password"] {{
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }}
                input[type="submit"] {{
                    width: 100%;
                    padding: 12px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }}
                input[type="submit"]:hover {{
                    background-color: #45a049;
                }}
                .error {{
                    color: #ff0000;
                    text-align: center;
                    margin-top: 10px;
                }}
                .demo-accounts {{
                    margin-top: 20px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }}
                .tab-buttons {{
                    display: flex;
                    border-bottom: 1px solid #ddd;
                }}
                .tab-button {{
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                }}
                .tab-button.active {{
                    background-color: #f8f8f8;
                    border-bottom: 2px solid #4CAF50;
                    color: #333;
                }}
                .tab-content {{
                    display: none;
                    padding: 15px;
                    background-color: #f8f8f8;
                }}
                .tab-content.active {{
                    display: block;
                }}
                .account-info {{
                    margin: 5px 0;
                    font-size: 0.9em;
                }}
                .use-credentials {{
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9em;
                    margin-top: 10px;
                }}
                .use-credentials:hover {{
                    background-color: #45a049;
                }}
            </style>
        </head>
        <body>
            <div class="login-container">
                <h1>MediSync Login</h1>
                <form method="post" id="loginForm">
                    <div class="form-group">
                        <input type="text" name="username" id="username" placeholder="Username or Email" value="admin">
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" id="password" placeholder="Password" value="admin123">
                    </div>
                    <input type="submit" value="Login">
                    <div class="error">{error_message}</div>
                </form>
                
                <div class="demo-accounts">
                    <div class="tab-buttons">
                        <button class="tab-button active" onclick="showTab('admin')">Admin Account</button>
                        <button class="tab-button" onclick="showTab('doctor')">Doctor Account</button>
                        <button class="tab-button" onclick="showTab('nurse')">Nurse Account</button>
                    </div>
                    
                    <div id="admin" class="tab-content active">
                        <div class="account-info">Username: admin</div>
                        <div class="account-info">Password: admin123</div>
                        <div class="account-info">Role: Administrator</div>
                        <button class="use-credentials" onclick="useCredentials('admin', 'admin123')">Use These Credentials</button>
                    </div>
                    
                    <div id="doctor" class="tab-content">
                        <div class="account-info">Username: doctor</div>
                        <div class="account-info">Password: doctor123</div>
                        <div class="account-info">Role: Doctor</div>
                        <button class="use-credentials" onclick="useCredentials('doctor', 'doctor123')">Use These Credentials</button>
                    </div>
                    
                    <div id="nurse" class="tab-content">
                        <div class="account-info">Username: nurse</div>
                        <div class="account-info">Password: nurse123</div>
                        <div class="account-info">Role: Nurse</div>
                        <button class="use-credentials" onclick="useCredentials('nurse', 'nurse123')">Use These Credentials</button>
                    </div>
                </div>
            </div>
            
            <script>
                function showTab(tabId) {{
                    // Hide all tabs
                    document.querySelectorAll('.tab-content').forEach(tab => {{
                        tab.classList.remove('active');
                    }});
                    document.querySelectorAll('.tab-button').forEach(button => {{
                        button.classList.remove('active');
                    }});
                    
                    // Show selected tab
                    document.getElementById(tabId).classList.add('active');
                    document.querySelector(`[onclick="showTab('${{tabId}}')"]`).classList.add('active');
                }}
                
                function useCredentials(username, password) {{
                    document.getElementById('username').value = username;
                    document.getElementById('password').value = password;
                }}
            </script>
        </body>
        </html>
    '''

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

def main():
    """Main entry point for the application."""
    # Initialize database
    with app.app_context():
        db.create_all()
    
    # Run the application
    ssl_context = ('certs/cert.pem', 'certs/key.pem')
    app.run(debug=False, ssl_context=ssl_context)

if __name__ == '__main__':
    main()