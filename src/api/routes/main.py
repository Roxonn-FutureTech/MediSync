"""Main routes for the MediSync API."""

from flask import Blueprint, jsonify, send_from_directory
from ..extensions import cache
from ..middleware.security import require_ssl
import os
from flask import current_app

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@require_ssl
def index():
    """API root endpoint showing available endpoints."""
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

@main_bp.route('/health')
@cache.cached(timeout=60)
@require_ssl
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "OK"}), 200

@main_bp.route('/docs')
@require_ssl
@cache.cached(timeout=300)
def docs():
    """API documentation endpoint."""
    try:
        with open(os.path.join(current_app.config['DOCS_PATH'], 'API.md'), 'r') as f:
            content = f.read()
            return content, 200, {'Content-Type': 'text/markdown'}
    except FileNotFoundError:
        return jsonify({
            'error': 'Documentation Not Found',
            'message': 'The API documentation is currently unavailable',
            'status_code': 404
        }), 404 