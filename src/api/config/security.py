from datetime import timedelta
import os
from dotenv import load_dotenv
import secrets

# Load environment variables
load_dotenv()

# Get absolute path for logs
LOG_DIR = os.path.abspath(os.getenv('LOG_DIR', 'logs'))

class SecurityConfig:
    # Generate a secure key for database encryption
    DATABASE_ENCRYPTION_KEY = os.getenv('DATABASE_ENCRYPTION_KEY', secrets.token_urlsafe(32))
    
    # SSL/TLS Configuration
    SSL_CERT_PATH = os.getenv('SSL_CERT_PATH', 'certs/cert.pem')
    SSL_KEY_PATH = os.getenv('SSL_KEY_PATH', 'certs/key.pem')
    
    # Security Headers
    SECURITY_HEADERS = {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';",
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
    
    # Session Configuration
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)  # HIPAA requires session timeout
    
    # CSRF Protection
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour
    
    # Password Policy (HIPAA Compliant)
    PASSWORD_POLICY = {
        'MIN_LENGTH': 8,
        'REQUIRE_UPPERCASE': True,
        'REQUIRE_LOWERCASE': True,
        'REQUIRE_NUMBERS': True,
        'REQUIRE_SPECIAL_CHARS': True,
        'MAX_PASSWORD_AGE_DAYS': 90,
        'PASSWORD_HISTORY_COUNT': 6
    }
    
    # Logging Configuration
    LOG_CONFIG = {
        'version': 1,
        'formatters': {
            'detailed': {
                'format': '%(asctime)s %(levelname)s [%(name)s] %(message)s'
            }
        },
        'handlers': {
            'security_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': 'logs/security.log',
                'maxBytes': 10485760,  # 10MB
                'backupCount': 5,
                'formatter': 'detailed',
            },
            'access_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': 'logs/access.log',
                'maxBytes': 10485760,  # 10MB
                'backupCount': 5,
                'formatter': 'detailed',
            }
        },
        'loggers': {
            'security': {
                'handlers': ['security_file'],
                'level': 'INFO',
            },
            'access': {
                'handlers': ['access_file'],
                'level': 'INFO',
            }
        }
    } 