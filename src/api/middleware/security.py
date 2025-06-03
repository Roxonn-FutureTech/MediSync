from functools import wraps
from flask import request, abort, current_app
import logging
import logging.config
from datetime import datetime
from ..config.security import SecurityConfig

# Initialize loggers
security_logger = logging.getLogger('security')
access_logger = logging.getLogger('access')

def apply_security_headers(response):
    """Apply security headers to all responses"""
    for header, value in SecurityConfig.SECURITY_HEADERS.items():
        response.headers[header] = value
    return response

def log_access():
    """Log access details"""
    access_logger.info(
        f"Access: {request.remote_addr} - {request.method} {request.path} - "
        f"User-Agent: {request.headers.get('User-Agent')} - "
        f"Timestamp: {datetime.utcnow().isoformat()}"
    )

def require_ssl(f):
    """Ensure request is over HTTPS"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_secure and not current_app.debug:
            abort(403, description="SSL/TLS required")
        return f(*args, **kwargs)
    return decorated_function

def validate_content_type(f):
    """Validate and sanitize content type"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method in ['POST', 'PUT'] and not request.is_json:
            abort(400, description="Content-Type must be application/json")
        return f(*args, **kwargs)
    return decorated_function

def audit_log(event_type):
    """Decorator to log security-relevant events"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                result = f(*args, **kwargs)
                security_logger.info(
                    f"Security Event: {event_type} - Success - "
                    f"IP: {request.remote_addr} - "
                    f"Method: {request.method} - "
                    f"Path: {request.path}"
                )
                return result
            except Exception as e:
                security_logger.error(
                    f"Security Event: {event_type} - Failure - "
                    f"IP: {request.remote_addr} - "
                    f"Method: {request.method} - "
                    f"Path: {request.path} - "
                    f"Error: {str(e)}"
                )
                raise
        return decorated_function
    return decorator

def init_security_middleware(app):
    """Initialize security middleware"""
    # Create logs directory if it doesn't exist
    import os
    if not os.path.exists('logs'):
        os.makedirs('logs')
        
    # Configure logging
    logging.config.dictConfig(SecurityConfig.LOG_CONFIG)
    
    # Apply security headers to all responses
    app.after_request(apply_security_headers)
    
    # Log all requests
    app.before_request(log_access)
    
    # Ensure all responses don't cache sensitive data
    @app.after_request
    def add_no_cache_headers(response):
        if request.path.startswith('/api/'):
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            response.headers['Pragma'] = 'no-cache'
        return response 