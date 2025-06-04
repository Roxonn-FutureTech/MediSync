"""Database models for the MediSync application.

This module contains SQLAlchemy models that represent the database schema
for the MediSync application, including users, hospitals, and related entities.
"""

from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import event
from flask_login import UserMixin
from .utils.encryption import EncryptedField
import uuid
from .extensions import db

class BaseModel(db.Model):
    """Base model class with common fields"""
    __abstract__ = True
    
    @declared_attr
    def __tablename__(cls):
        """Generate table name from class name."""
        return cls.__name__.lower()

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    active = db.Column(db.Boolean, default=True)  # renamed from is_active to active

class AuditMixin:
    """Mixin for audit trail"""
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    updated_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# User and Authentication Models
class User(BaseModel, UserMixin):
    """User model for authentication and authorization"""
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(EncryptedField(), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    last_login = db.Column(db.DateTime)
    password_changed_at = db.Column(db.DateTime)
    failed_login_attempts = db.Column(db.Integer, default=0)
    is_locked = db.Column(db.Boolean, default=False)
    
    # Relationships
    audit_logs = db.relationship('AuditLog', backref='user', foreign_keys='AuditLog.created_by_id')
    created_records = db.relationship('AuditLog', backref='creator', foreign_keys='AuditLog.created_by_id')
    updated_records = db.relationship('AuditLog', backref='updater', foreign_keys='AuditLog.updated_by_id')

    def get_id(self):
        """Return the user ID as a string."""
        return str(self.id)

    @property
    def is_active(self):
        """Check if the user account is active."""
        return self.active and not self.is_locked

    def is_authenticated(self):
        """Check if the user is authenticated."""
        return True

    def is_anonymous(self):
        """Check if the user is anonymous."""
        return False

class PasswordHistory(BaseModel):
    """Track password history for password policy enforcement"""
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

# Patient-related Models
class Patient(BaseModel, AuditMixin):
    """Patient information model"""
    mrn = db.Column(db.String(20), unique=True, nullable=False)  # Medical Record Number
    first_name = db.Column(EncryptedField(), nullable=False)
    last_name = db.Column(EncryptedField(), nullable=False)
    date_of_birth = db.Column(EncryptedField(), nullable=False)
    gender = db.Column(db.String(10))
    blood_type = db.Column(db.String(5))
    ssn = db.Column(EncryptedField())  # Social Security Number
    address = db.Column(EncryptedField())
    phone = db.Column(EncryptedField())
    email = db.Column(EncryptedField())
    insurance_provider = db.Column(EncryptedField())
    insurance_id = db.Column(EncryptedField())
    
    # Relationships
    medical_records = db.relationship('MedicalRecord', backref='patient')
    emergency_contacts = db.relationship('EmergencyContact', backref='patient')
    appointments = db.relationship('Appointment', backref='patient')
    medications = db.relationship('Medication', backref='patient')

class EmergencyContact(BaseModel, AuditMixin):
    """Emergency contact information"""
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    name = db.Column(EncryptedField(), nullable=False)
    relationship = db.Column(db.String(50), nullable=False)
    phone = db.Column(EncryptedField(), nullable=False)
    address = db.Column(EncryptedField())
    is_primary = db.Column(db.Boolean, default=False)

class MedicalRecord(BaseModel, AuditMixin):
    """Medical history and records"""
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    record_type = db.Column(db.String(50), nullable=False)
    description = db.Column(EncryptedField(), nullable=False)
    diagnosis = db.Column(EncryptedField())
    treatment = db.Column(EncryptedField())
    notes = db.Column(EncryptedField())
    record_date = db.Column(db.DateTime, nullable=False)
    
    # Relationships
    attachments = db.relationship('MedicalAttachment', backref='medical_record')

class MedicalAttachment(BaseModel):
    """Attachments for medical records"""
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medicalrecord.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_hash = db.Column(db.String(64), nullable=False)
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    updated_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Medication(BaseModel, AuditMixin):
    """Patient medication tracking"""
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    prescriber = db.Column(db.String(100), nullable=False)
    pharmacy = db.Column(db.String(100))
    notes = db.Column(EncryptedField())
    is_active = db.Column(db.Boolean, default=True)

class Appointment(BaseModel, AuditMixin):
    """Appointment scheduling"""
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_type = db.Column(db.String(50), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    status = db.Column(db.String(20), nullable=False)
    notes = db.Column(EncryptedField())
    
    # Relationships
    reminders = db.relationship('AppointmentReminder', backref='appointment')

class AppointmentReminder(BaseModel):
    """Appointment reminders"""
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'), nullable=False)
    reminder_type = db.Column(db.String(20), nullable=False)  # email, sms, etc.
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)

class Hospital(BaseModel, AuditMixin):
    """Hospital information"""
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(EncryptedField(), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    emergency_dept = db.Column(db.Boolean, default=True)
    
    # Relationships
    departments = db.relationship('Department', backref='hospital')

class Department(BaseModel, AuditMixin):
    """Hospital departments"""
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    head_doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# Audit and Logging
class AuditLog(BaseModel):
    """Comprehensive audit logging"""
    event_type = db.Column(db.String(50), nullable=False)
    table_name = db.Column(db.String(50), nullable=False)
    record_id = db.Column(db.Integer, nullable=False)
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(200))
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    updated_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# Database Backup Log
class BackupLog(BaseModel):
    """Track database backups"""
    backup_type = db.Column(db.String(20), nullable=False)  # full, incremental
    file_path = db.Column(db.String(500), nullable=False)
    file_hash = db.Column(db.String(64), nullable=False)
    size_bytes = db.Column(db.BigInteger, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    error_message = db.Column(db.Text)
    completed_at = db.Column(db.DateTime)

# Event listeners for audit trail
@event.listens_for(db.Session, 'before_flush')
def create_audit_log(session, flush_context, instances):
    """Create audit log entries for database changes"""
    for obj in session.new:
        if isinstance(obj, (BaseModel, AuditMixin)) and not isinstance(obj, AuditLog):
            log = AuditLog(
                event_type='CREATE',
                table_name=obj.__tablename__,
                record_id=obj.id if obj.id else 0,
                new_values={c.name: getattr(obj, c.name) for c in obj.__table__.columns},
                created_by_id=getattr(obj, 'created_by_id', None)
            )
            session.add(log)

    for obj in session.dirty:
        if isinstance(obj, (BaseModel, AuditMixin)) and not isinstance(obj, AuditLog):
            changes = {}
            for attr in obj.__mapper__.attrs:
                hist = db.inspect(obj).attrs[attr.key].history
                if hist.has_changes():
                    changes[attr.key] = [hist.deleted, hist.added]
            
            if changes:
                log = AuditLog(
                    event_type='UPDATE',
                    table_name=obj.__tablename__,
                    record_id=obj.id,
                    old_values={k: v[0] for k, v in changes.items()},
                    new_values={k: v[1] for k, v in changes.items()},
                    updated_by_id=getattr(obj, 'updated_by_id', None)
                )
                session.add(log)

    for obj in session.deleted:
        if isinstance(obj, (BaseModel, AuditMixin)) and not isinstance(obj, AuditLog):
            log = AuditLog(
                event_type='DELETE',
                table_name=obj.__tablename__,
                record_id=obj.id,
                old_values={c.name: getattr(obj, c.name) for c in obj.__table__.columns},
                updated_by_id=getattr(obj, 'updated_by_id', None)
            )
            session.add(log) 