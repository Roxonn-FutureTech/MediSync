"""Initial database schema

Revision ID: 1a2b3c4d5e6f
Revises: 
Create Date: 2024-01-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from src.api.utils.encryption import EncryptedField

# revision identifiers, used by Alembic.
revision = '1a2b3c4d5e6f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create User table
    op.create_table('user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(50), unique=True, nullable=False),
        sa.Column('email', EncryptedField(), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('password_changed_at', sa.DateTime(), nullable=True),
        sa.Column('failed_login_attempts', sa.Integer(), default=0),
        sa.Column('is_locked', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create PasswordHistory table
    op.create_table('password_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create Patient table
    op.create_table('patient',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('mrn', sa.String(20), unique=True, nullable=False),
        sa.Column('first_name', EncryptedField(), nullable=False),
        sa.Column('last_name', EncryptedField(), nullable=False),
        sa.Column('date_of_birth', EncryptedField(), nullable=False),
        sa.Column('gender', sa.String(10)),
        sa.Column('blood_type', sa.String(5)),
        sa.Column('ssn', EncryptedField()),
        sa.Column('address', EncryptedField()),
        sa.Column('phone', EncryptedField()),
        sa.Column('email', EncryptedField()),
        sa.Column('insurance_provider', EncryptedField()),
        sa.Column('insurance_id', EncryptedField()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create EmergencyContact table
    op.create_table('emergency_contact',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('name', EncryptedField(), nullable=False),
        sa.Column('relationship', sa.String(50), nullable=False),
        sa.Column('phone', EncryptedField(), nullable=False),
        sa.Column('address', EncryptedField()),
        sa.Column('is_primary', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patient.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create MedicalRecord table
    op.create_table('medical_record',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('record_type', sa.String(50), nullable=False),
        sa.Column('description', EncryptedField(), nullable=False),
        sa.Column('diagnosis', EncryptedField()),
        sa.Column('treatment', EncryptedField()),
        sa.Column('notes', EncryptedField()),
        sa.Column('record_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patient.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create MedicalAttachment table
    op.create_table('medical_attachment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('medical_record_id', sa.Integer(), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_type', sa.String(50), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_hash', sa.String(64), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['medical_record_id'], ['medical_record.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create Medication table
    op.create_table('medication',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('dosage', sa.String(50), nullable=False),
        sa.Column('frequency', sa.String(50), nullable=False),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime()),
        sa.Column('prescriber', sa.String(100), nullable=False),
        sa.Column('pharmacy', sa.String(100)),
        sa.Column('notes', EncryptedField()),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patient.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create Hospital table
    op.create_table('hospital',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('address', sa.String(200), nullable=False),
        sa.Column('phone', EncryptedField(), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('emergency_dept', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create Department table
    op.create_table('department',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hospital_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('head_doctor_id', sa.Integer()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['hospital_id'], ['hospital.id']),
        sa.ForeignKeyConstraint(['head_doctor_id'], ['user.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create Appointment table
    op.create_table('appointment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('doctor_id', sa.Integer(), nullable=False),
        sa.Column('appointment_type', sa.String(50), nullable=False),
        sa.Column('scheduled_time', sa.DateTime(), nullable=False),
        sa.Column('duration', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('notes', EncryptedField()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('updated_by_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patient.id']),
        sa.ForeignKeyConstraint(['doctor_id'], ['user.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create AppointmentReminder table
    op.create_table('appointment_reminder',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('appointment_id', sa.Integer(), nullable=False),
        sa.Column('reminder_type', sa.String(20), nullable=False),
        sa.Column('scheduled_time', sa.DateTime(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.ForeignKeyConstraint(['appointment_id'], ['appointment.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create AuditLog table
    op.create_table('audit_log',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('table_name', sa.String(50), nullable=False),
        sa.Column('record_id', sa.Integer(), nullable=False),
        sa.Column('old_values', sa.JSON()),
        sa.Column('new_values', sa.JSON()),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.String(200)),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_by_id', sa.Integer()),
        sa.Column('updated_by_id', sa.Integer()),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.ForeignKeyConstraint(['updated_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create BackupLog table
    op.create_table('backup_log',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('backup_type', sa.String(20), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_hash', sa.String(64), nullable=False),
        sa.Column('size_bytes', sa.BigInteger(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('error_message', sa.Text()),
        sa.Column('completed_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    # Drop tables in reverse order of creation
    op.drop_table('backup_log')
    op.drop_table('audit_log')
    op.drop_table('appointment_reminder')
    op.drop_table('appointment')
    op.drop_table('department')
    op.drop_table('hospital')
    op.drop_table('medication')
    op.drop_table('medical_attachment')
    op.drop_table('medical_record')
    op.drop_table('emergency_contact')
    op.drop_table('patient')
    op.drop_table('password_history')
    op.drop_table('user') 