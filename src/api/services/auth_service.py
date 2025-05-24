from datetime import datetime, timedelta
import pyotp
import bcrypt
import uuid
import jwt
from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token
from ..models.user import User, AuditLog, db
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import os

class AuthService:
    _private_key = None
    _public_key = None
    
    @classmethod
    def load_keys(cls):
        """Load or generate RSA keys for JWT signing."""
        if cls._private_key and cls._public_key:
            return
            
        private_key_path = os.environ.get('JWT_PRIVATE_KEY_PATH')
        public_key_path = os.environ.get('JWT_PUBLIC_KEY_PATH')
        
        if private_key_path and public_key_path:
            # Load existing keys
            with open(private_key_path, 'rb') as f:
                cls._private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None
                )
            with open(public_key_path, 'rb') as f:
                cls._public_key = serialization.load_pem_public_key(
                    f.read()
                )
        else:
            # Generate new keys
            cls._private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048
            )
            cls._public_key = cls._private_key.public_key()
            
            # Save keys if paths are provided
            if private_key_path:
                private_bytes = cls._private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                )
                with open(private_key_path, 'wb') as f:
                    f.write(private_bytes)
                    
            if public_key_path:
                public_bytes = cls._public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                )
                with open(public_key_path, 'wb') as f:
                    f.write(public_bytes)

    @staticmethod
    def generate_uniquifier() -> str:
        """Generate a unique identifier for Flask-Security."""
        return str(uuid.uuid4())

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        if isinstance(password, str):
            password = password.encode('utf-8')
        return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def check_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash."""
        if isinstance(password, str):
            password = password.encode('utf-8')
        if isinstance(hashed, str):
            hashed = hashed.encode('utf-8')
        try:
            return bcrypt.checkpw(password, hashed)
        except Exception as e:
            print(f"Password check error: {str(e)}")
            return False
    
    @staticmethod
    def generate_2fa_secret() -> str:
        return pyotp.random_base32()
    
    @staticmethod
    def verify_2fa_token(secret: str, token: str) -> bool:
        totp = pyotp.TOTP(secret)
        return totp.verify(token)
    
    @classmethod
    def create_tokens(cls, user_id: int) -> dict:
        """Create access and refresh tokens."""
        access_token = create_access_token(
            identity=str(user_id),  # Convert to string
            fresh=True
        )
        
        refresh_token = create_refresh_token(
            identity=str(user_id)  # Convert to string
        )
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
    @classmethod
    def verify_token(cls, token: str) -> dict:
        """Verify a JWT token using the public key."""
        cls.load_keys()
        try:
            return jwt.decode(
                token,
                cls._public_key,
                algorithms=['RS256']
            )
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def log_audit(user_id: int, action: str, details: str, ip_address: str) -> None:
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address
        )
        db.session.add(audit_log)
        db.session.commit()
    
    @staticmethod
    def update_login_info(user: User, ip_address: str) -> None:
        user.last_login_at = datetime.utcnow()
        user.last_login_ip = ip_address
        db.session.commit()
    
    @staticmethod
    def generate_password_reset_token(user: User) -> str:
        token = pyotp.random_base32()
        user.reset_password_token = token
        user.reset_password_expires = datetime.utcnow() + timedelta(hours=24)
        db.session.commit()
        return token
    
    @staticmethod
    def verify_reset_token(token: str) -> User:
        user = User.query.filter_by(reset_password_token=token).first()
        if not user or user.reset_password_expires < datetime.utcnow():
            return None 