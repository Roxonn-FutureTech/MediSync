from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
from sqlalchemy.types import TypeDecorator, String
import secrets

class EncryptionService:
    def __init__(self, key=None):
        """Initialize encryption service with a key or generate one"""
        if key is None:
            key = os.getenv('DATABASE_ENCRYPTION_KEY', secrets.token_hex(32))
        self.fernet = Fernet(self._get_or_create_key(key))
    
    def _get_or_create_key(self, key):
        """Generate a Fernet key from the provided key"""
        salt = b'medisync_salt'  # In production, use a secure random salt
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key_bytes = key.encode()
        key = base64.urlsafe_b64encode(kdf.derive(key_bytes))
        return key
    
    def encrypt(self, data):
        """Encrypt data"""
        if not isinstance(data, bytes):
            data = str(data).encode()
        return self.fernet.encrypt(data)
    
    def decrypt(self, encrypted_data):
        """Decrypt data"""
        return self.fernet.decrypt(encrypted_data)
    
    @staticmethod
    def generate_key():
        """Generate a new encryption key"""
        return base64.urlsafe_b64encode(os.urandom(32)).decode()

class EncryptedField(TypeDecorator):
    """SQLAlchemy type for encrypted fields"""
    impl = String
    cache_ok = True

    def __init__(self, length=None, **kwargs):
        if length is None:
            length = 500  # Encrypted data will be longer than original
        super().__init__(length, **kwargs)
        self.encryption_service = EncryptionService()

    def process_bind_param(self, value, dialect):
        """Encrypt value before storing in database"""
        if value is None:
            return None
        encrypted = self.encryption_service.encrypt(value)
        return encrypted.decode('utf-8')  # Store as string in DB

    def process_result_value(self, value, dialect):
        """Decrypt value retrieved from database"""
        if value is None:
            return None
        decrypted = self.encryption_service.decrypt(value.encode('utf-8'))
        return decrypted.decode('utf-8') 