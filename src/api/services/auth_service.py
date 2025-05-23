from datetime import datetime, timedelta
import pyotp
import bcrypt
import uuid
from flask_jwt_extended import create_access_token, create_refresh_token
from ..models.user import User, AuditLog, db

class AuthService:
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
    
    @staticmethod
    def create_tokens(user_id: int) -> dict:
        access_token = create_access_token(
            identity=user_id,
            fresh=True,
            expires_delta=timedelta(minutes=15)
        )
        refresh_token = create_refresh_token(
            identity=user_id,
            expires_delta=timedelta(days=30)
        )
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
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
        return user 