import os
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

def setup_logging(app):
    """Configure logging for the application."""
    log_dir = Path(app.config['LOG_DIR'])
    log_dir.mkdir(exist_ok=True)

    # Set log level
    log_level = getattr(logging, app.config['LOG_LEVEL'].upper())
    
    # Format for logs
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )

    # Application log
    app_log = log_dir / 'app.log'
    app_handler = RotatingFileHandler(
        app_log,
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    app_handler.setFormatter(formatter)
    app_handler.setLevel(log_level)
    app.logger.addHandler(app_handler)
    
    # Access log
    access_log = log_dir / 'access.log'
    access_handler = RotatingFileHandler(
        access_log,
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    access_handler.setFormatter(formatter)
    access_handler.setLevel(logging.INFO)
    logging.getLogger('werkzeug').addHandler(access_handler)
    
    # Error log
    error_log = log_dir / 'error.log'
    error_handler = RotatingFileHandler(
        error_log,
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    error_handler.setFormatter(formatter)
    error_handler.setLevel(logging.ERROR)
    app.logger.addHandler(error_handler)
    
    # Security log
    security_log = log_dir / 'security.log'
    security_handler = RotatingFileHandler(
        security_log,
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    security_handler.setFormatter(formatter)
    security_handler.setLevel(logging.INFO)
    security_logger = logging.getLogger('security')
    security_logger.addHandler(security_handler)
    
    # Set base logging level
    app.logger.setLevel(log_level)
    
    # Log startup
    app.logger.info(f'Logging setup completed. Level: {app.config["LOG_LEVEL"]}') 