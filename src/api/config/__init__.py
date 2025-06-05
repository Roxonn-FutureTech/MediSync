"""Configuration module for the MediSync API.

This module contains different configuration classes for various environments
(development, testing, production).
"""

import os
from datetime import timedelta

class Config:
    """Base configuration."""
    
    # Basic Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Instance path configuration
    INSTANCE_PATH = os.environ.get('INSTANCE_PATH') or os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'instance')
    
    # Security
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    
    # Cache
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Rate limiting
    RATELIMIT_STORAGE_URL = os.getenv('REDIS_URL', 'memory://')
    RATELIMIT_STRATEGY = 'fixed-window'
    
    # File paths
    DOCS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')
    LOGS_PATH = os.path.join(INSTANCE_PATH, 'logs')

class DevelopmentConfig(Config):
    """Development configuration."""
    
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        f'sqlite:///{os.path.join(Config.INSTANCE_PATH, "dev.db")}'
    SQLALCHEMY_ECHO = True

class TestingConfig(Config):
    """Testing configuration."""
    
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    """Production configuration."""
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'sqlite:///{os.path.join(Config.INSTANCE_PATH, "medisync.db")}'
    
    # Production security settings
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config(config_name):
    """Get configuration class by name.
    
    Args:
        config_name (str): Name of the configuration to use
            ('development', 'testing', or 'production')
    
    Returns:
        class: Configuration class
    """
    return config.get(config_name, DevelopmentConfig) 