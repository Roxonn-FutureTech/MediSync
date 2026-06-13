from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from datetime import datetime, timezone
from marshmallow import ValidationError
from src.api.schemas import HospitalSchema
from pathlib import Path
import logging
import os


def resolve_log_level(level_name):
    normalized_level = str(level_name or 'INFO').upper()
    return getattr(logging, normalized_level, logging.INFO)


def should_enable_debug(value):
    return str(value or '').lower() in {'1', 'true', 'yes', 'on'}


def resolve_database_uri():
    database_uri = os.getenv('DATABASE_URI')
    if database_uri:
        return database_uri
    return f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"


def ensure_default_database_directory():
    try:
        DEFAULT_DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        raise RuntimeError(
            f"Unable to create Flask instance directory for SQLite database: "
            f"{DEFAULT_DATABASE_PATH.parent}"
        ) from exc


# Initialize Flask app
app = Flask(__name__)
DEFAULT_DATABASE_PATH = Path(app.instance_path) / 'emergency_portal.db'
app.config['SQLALCHEMY_DATABASE_URI'] = resolve_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes
app.config['DOCS_PATH'] = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')

log_level = resolve_log_level(os.getenv('LOG_LEVEL', 'INFO'))
logging.basicConfig(level=log_level)
app.logger.setLevel(log_level)

# Initialize extensions
db = SQLAlchemy()
db.init_app(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
cache = Cache(app)

# Models
class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
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

@app.errorhandler(500)
def handle_internal_server_error(error):
    app.logger.exception('Unhandled API error: %s', error)
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred',
        'status_code': 500
    }), 500

# Routes
@app.route('/')
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
        "documentation": "/docs"  # Future endpoint for API documentation
    }), 200

@app.route('/health')
@cache.cached(timeout=60)
def health_check():
    return jsonify({"status": "OK"}), 200

@app.route('/api/hospitals', methods=['POST'])
@limiter.limit("10 per minute")
def register_hospital():
    schema = HospitalSchema()
    data = schema.load(request.json)
    new_hospital = Hospital(
        name=data['name'],
        address=data['address'],
        phone=data['phone'],
        capacity=data['capacity']
    )
    db.session.add(new_hospital)
    db.session.commit()
    return jsonify(schema.dump(new_hospital)), 201

@app.route('/api/hospitals', methods=['GET'])
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
def get_hospitals():
    hospitals = Hospital.query.all()
    schema = HospitalSchema(many=True)
    return jsonify(schema.dump(hospitals)), 200

@app.route('/api/hospitals/<int:hospital_id>', methods=['GET'])
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
def get_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    schema = HospitalSchema()
    return jsonify(schema.dump(hospital)), 200

@app.route('/api/hospitals/<int:hospital_id>', methods=['PUT'])
@limiter.limit("10 per minute")
def update_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    schema = HospitalSchema()
    data = schema.load(request.json)
    
    hospital.name = data['name']
    hospital.address = data['address']
    hospital.phone = data['phone']
    hospital.capacity = data['capacity']
    db.session.commit()
    return jsonify(schema.dump(hospital)), 200

@app.route('/api/hospitals/<int:hospital_id>', methods=['DELETE'])
@limiter.limit("10 per minute")
def delete_hospital(hospital_id):
    hospital = Hospital.query.get_or_404(hospital_id)
    db.session.delete(hospital)
    db.session.commit()
    return '', 204

@app.route('/docs')
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

if __name__ == '__main__':
    if app.config['SQLALCHEMY_DATABASE_URI'] == f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}":
        ensure_default_database_directory()
    with app.app_context():
        db.create_all()
    app.run(debug=should_enable_debug(os.getenv('FLASK_DEBUG')))
