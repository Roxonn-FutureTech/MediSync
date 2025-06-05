"""Middleware package for the MediSync API.

This package contains security and utility middleware for the application.
"""

import secrets
from flask import session, request, abort
from functools import wraps

def init_security_middleware(app):
    """Initialize security middleware for the application.
    
    Args:
        app: Flask application instance
    """
    @app.before_request
    def validate_json():
        """Validate JSON content before processing the request."""
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.headers.get('Content-Type') == 'application/json':
                if not request.is_json:
                    abort(400, description="Content-Type is application/json but no JSON data received")

    @app.before_request
    def csrf_protect():
        """Protect against CSRF attacks by validating token."""
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            token = None
            
            # Check for token in headers first
            if 'X-CSRF-Token' in request.headers:
                token = request.headers['X-CSRF-Token']
            # Then check form data
            elif request.form:
                token = request.form.get('_csrf_token')
            
            if not token or token != session.get('_csrf_token'):
                abort(403, description="CSRF token validation failed")

    @app.before_request
    def parse_json_request():
        """Parse and validate JSON request data."""
        if request.is_json:
            try:
                request.get_json()
            except Exception:
                abort(400, description="Invalid JSON data")

def generate_csrf_token():
    """Generate a new CSRF token or return existing one from session.
    
    Returns:
        str: CSRF token
    """
    if '_csrf_token' not in session:
        session['_csrf_token'] = secrets.token_hex(32)
    return session['_csrf_token']

def require_csrf_token(f):
    """Decorator to require CSRF token for a route.
    
    Args:
        f: Function to decorate
    
    Returns:
        function: Decorated function
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            token = request.headers.get('X-CSRF-Token') or request.form.get('_csrf_token')
            if not token or token != session.get('_csrf_token'):
                abort(403, description="CSRF token validation failed")
        return f(*args, **kwargs)
    return decorated_function 