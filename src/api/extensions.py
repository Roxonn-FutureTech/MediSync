"""Flask extensions initialization module.

This module initializes Flask extensions used throughout the application
and provides functions to configure them properly.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_admin import Admin

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)
admin = Admin(name='MediSync Admin', template_mode='bootstrap4')

def init_limiter(app):
    return Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )

def init_extensions(app):
    """Initialize all Flask extensions.
    
    Args:
        app: Flask application instance
    """
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    admin.init_app(app)
    return init_limiter(app)

def init_login_manager(app):
    """Configure the Flask-Login extension.
    
    Args:
        app: Flask application instance
    """
    login_manager.login_view = 'login'
    login_manager.login_message_category = 'info'
    login_manager.session_protection = 'strong' 