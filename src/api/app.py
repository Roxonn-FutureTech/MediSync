from flask import Flask, jsonify, request, send_from_directory, session, abort
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from datetime import datetime, timezone
from marshmallow import ValidationError
from src.api.schemas import HospitalSchema, ErrorSchema
from src.api.middleware.security import init_security_middleware, require_ssl, validate_content_type, audit_log
from src.api.utils.encryption import EncryptedField
import os
import secrets

# Initialize Flask app
app = Flask(__name__)

# Security Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', os.urandom(32))  # Change in production
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///emergency_portal.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes
app.config['DOCS_PATH'] = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')
app.config['SESSION_COOKIE_SECURE'] = True
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

# Initialize security middleware
init_security_middleware(app)

# CSRF Protection for web routes
def generate_csrf_token():
    if '_csrf_token' not in session:
        session['_csrf_token'] = secrets.token_hex(32)
    return session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generate_csrf_token

@app.before_request
def csrf_protect():
    # Skip CSRF for API routes and non-form requests
    if request.path.startswith('/api/') or request.method == 'GET':
        return
    
    # Check for CSRF token in headers for AJAX requests
    if request.is_xhr:
        token = request.headers.get('X-CSRF-Token')
    else:
        token = request.form.get('_csrf_token')
    
    stored_token = session.get('_csrf_token')
    if not token or not stored_token or token != stored_token:
        abort(400, description="CSRF token missing or invalid")

# Custom request parser for JSON requests
@app.before_request
def parse_json_request():
    if request.is_json:
        try:
            request.json
        except Exception as e:
            return jsonify({
                'error': 'Invalid JSON',
                'message': str(e),
                'status_code': 400
            }), 400

# Models with encryption
class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(EncryptedField(), nullable=False)  # Encrypted field
    capacity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,  # Will be automatically decrypted
            'capacity': self.capacity,
            'created_at': self.created_at.isoformat()
        }

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
        app.logger.error(f"Error in register_hospital: {str(e)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An error occurred while processing your request',
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # SSL context for development (use proper certificates in production)
    ssl_context = ('certs/cert.pem', 'certs/key.pem')
    app.run(debug=False, ssl_context=ssl_context)