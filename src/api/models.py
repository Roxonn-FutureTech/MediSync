from datetime import datetime, timezone
import enum
from src.api.app import db


class AppointmentStatus(enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(20), nullable=True)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    blood_type = db.Column(db.String(10), nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    medical_histories = db.relationship(
        "MedicalHistory",
        backref="patient",
        lazy=True,
        cascade="all, delete-orphan",
    )
    emergency_contacts = db.relationship(
        "EmergencyContact",
        backref="patient",
        lazy=True,
        cascade="all, delete-orphan",
    )
    appointments = db.relationship("Appointment", backref="patient", lazy=True)
    prescriptions = db.relationship("Prescription", backref="patient", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "dob": self.dob.isoformat() if self.dob else None,
            "gender": self.gender,
            "phone": self.phone,
            "email": self.email,
            "blood_type": self.blood_type,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }


class MedicalHistory(db.Model):
    __tablename__ = "medical_histories"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer, db.ForeignKey("patients.id"), nullable=False
    )
    condition_name = db.Column(db.String(255), nullable=False)
    diagnosis_date = db.Column(db.Date, nullable=True)
    allergies = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    recorded_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "condition_name": self.condition_name,
            "diagnosis_date": (
                self.diagnosis_date.isoformat() if self.diagnosis_date else None
            ),
            "allergies": self.allergies,
            "notes": self.notes,
            "recorded_at": (
                self.recorded_at.isoformat() if self.recorded_at else None
            ),
        }


class EmergencyContact(db.Model):
    __tablename__ = "emergency_contacts"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer, db.ForeignKey("patients.id"), nullable=False
    )
    name = db.Column(db.String(150), nullable=False)
    relationship = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "name": self.name,
            "relationship": self.relationship,
            "phone_number": self.phone_number,
            "is_primary": self.is_primary,
        }


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer, db.ForeignKey("patients.id"), nullable=False
    )
    doctor_id = db.Column(db.Integer, nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(
        db.Enum(AppointmentStatus),
        default=AppointmentStatus.SCHEDULED,
        nullable=False,
    )
    reason = db.Column(db.String(255), nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "scheduled_time": (
                self.scheduled_time.isoformat() if self.scheduled_time else None
            ),
            "status": self.status.value,
            "reason": self.reason,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }


class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer, db.ForeignKey("patients.id"), nullable=False
    )
    medication_name = db.Column(db.String(150), nullable=False)
    dosage = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    instructions = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "medication_name": self.medication_name,
            "dosage": self.dosage,
            "frequency": self.frequency,
            "start_date": (
                self.start_date.isoformat() if self.start_date else None
            ),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "instructions": self.instructions,
        }


class AuditTrail(db.Model):
    """Maintains immutable access and change logs for HIPAA compliance."""

    __tablename__ = "audit_trails"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    action = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50), nullable=False)
    resource_id = db.Column(db.Integer, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "ip_address": self.ip_address,
            "timestamp": self.timestamp.isoformat(),
        }