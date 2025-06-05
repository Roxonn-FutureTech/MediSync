"""Routes package for the MediSync API.

This package contains all route blueprints for different parts of the application.
"""

from flask import Blueprint

from .auth import auth_bp
from .hospitals import hospitals_bp
from .main import main_bp

# Import admin blueprint only if available
try:
    from .admin import admin_bp
except ImportError:
    admin_bp = None

def register_blueprints(app):
    """Register all blueprints with the application.
    
    Args:
        app: Flask application instance
    """
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(hospitals_bp, url_prefix='/api')
    
    # Register admin blueprint if available
    if admin_bp:
        app.register_blueprint(admin_bp, url_prefix='/admin')

__all__ = ['register_blueprints'] 