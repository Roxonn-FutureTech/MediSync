"""
MediSync API package
"""

__version__ = '0.1.0'

import os
from flask import Flask
from flask_talisman import Talisman
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache

from .extensions import db, limiter, cache, migrate, login_manager
from .models import User, Hospital
from .routes import register_blueprints
from .middleware import init_security_middleware
from .config import config, Config
from .errors import register_error_handlers
from .config.logging import setup_logging

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app(config_name='default'):
    """Create and configure the Flask application.
    
    Args:
        config_name (str): The name of the configuration to use.
            Defaults to 'default' which maps to development config.
    
    Returns:
        Flask: The configured Flask application instance.
    """
    app = Flask(__name__, 
                instance_path=Config.INSTANCE_PATH,
                instance_relative_config=True)
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    try:
        os.makedirs(Config.LOGS_PATH)
    except OSError:
        pass
    
    # Load configuration
    app.config.from_object(config[config_name])
    app.config.from_pyfile('config.py', silent=True)
    
    # Setup logging
    setup_logging(app)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)
    limiter.init_app(app)
    CORS(app)
    
    # Security
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
    
    with app.app_context():
        # Register blueprints
        from .routes.auth import auth_bp
        from .routes.api import api_bp
        from .routes.admin import admin_bp
        
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(api_bp, url_prefix='/api')
        app.register_blueprint(admin_bp, url_prefix='/admin')
        
        # Initialize security middleware
        init_security_middleware(app)
        
        # Register error handlers
        register_error_handlers(app)
        
        # Create database tables
        db.create_all()
    
    return app 