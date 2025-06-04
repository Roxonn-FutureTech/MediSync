"""Admin interface configuration for MediSync.

This module sets up the Flask-Admin interface for managing database models
and administrative tasks in the MediSync application.
"""

from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import SecureForm
from flask_login import current_user, LoginManager
from flask import redirect, url_for, flash, request
from werkzeug.security import generate_password_hash
from .models import (
    User, Patient, EmergencyContact, MedicalRecord, MedicalAttachment,
    Medication, Appointment, AppointmentReminder, Hospital, Department,
    AuditLog, BackupLog, db
)

# Initialize Flask-Login
login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Secure Admin Views
class SecureModelView(ModelView):
    """Base secure model view with authentication."""
    
    form_base_class = SecureForm
    
    def is_accessible(self):
        """Check if current user has access to model view."""
        return current_user.is_authenticated and current_user.role == 'admin'
    
    def inaccessible_callback(self, name, **kwargs):
        """Handle unauthorized access attempts."""
        flash('You need to be an admin to access this page.', 'error')
        return redirect(url_for('login'))

class SecureAdminIndexView(AdminIndexView):
    """Secure admin index view that requires authentication."""
    
    @expose('/')
    def index(self):
        if not current_user.is_authenticated or current_user.role != 'admin':
            return redirect(url_for('login'))
        return super(SecureAdminIndexView, self).index()

# Custom Model Views
class UserAdmin(SecureModelView):
    """Secure model view for User model with password hashing."""
    
    column_exclude_list = ['password_hash']
    form_excluded_columns = ['password_hash', 'last_login', 'password_changed_at', 'failed_login_attempts']
    column_searchable_list = ['username', 'email']
    column_filters = ['role', 'active', 'is_locked']
    
    def on_model_change(self, form, model, is_created):
        """Hash password before saving user model."""
        if is_created:
            model.password_hash = generate_password_hash('changeme123')

class PatientAdmin(SecureModelView):
    column_searchable_list = ['mrn', 'first_name', 'last_name']
    column_filters = ['gender', 'blood_type']

class MedicalRecordAdmin(SecureModelView):
    column_searchable_list = ['record_type', 'description']
    column_filters = ['record_type', 'record_date', 'active']
    form_excluded_columns = ['attachments']

class AppointmentAdmin(SecureModelView):
    column_searchable_list = ['appointment_type', 'status']
    column_filters = ['status', 'scheduled_time']

class HospitalAdmin(SecureModelView):
    column_searchable_list = ['name', 'address']
    column_filters = ['emergency_dept', 'capacity']

class DepartmentAdmin(SecureModelView):
    column_searchable_list = ['name']
    column_filters = ['capacity']

class AuditLogAdmin(SecureModelView):
    column_searchable_list = ['event_type', 'table_name']
    column_filters = ['event_type', 'table_name', 'created_at']
    can_create = False
    can_edit = False
    can_delete = False

def init_admin(app):
    """Initialize the admin interface.
    
    Args:
        app: Flask application instance
        
    Returns:
        Admin: Configured admin interface instance
    """
    admin = Admin(
        app,
        name='MediSync Admin',
        template_mode='bootstrap4',
        index_view=SecureAdminIndexView()
    )

    # Add model views
    admin.add_view(UserAdmin(User, db.session, category='User Management'))
    admin.add_view(PatientAdmin(Patient, db.session, category='Patients'))
    admin.add_view(SecureModelView(EmergencyContact, db.session, category='Patients'))
    admin.add_view(MedicalRecordAdmin(MedicalRecord, db.session, category='Medical Records'))
    admin.add_view(SecureModelView(MedicalAttachment, db.session, category='Medical Records'))
    admin.add_view(SecureModelView(Medication, db.session, category='Medical Records'))
    admin.add_view(AppointmentAdmin(Appointment, db.session, category='Appointments'))
    admin.add_view(SecureModelView(AppointmentReminder, db.session, category='Appointments'))
    admin.add_view(HospitalAdmin(Hospital, db.session, category='Facilities'))
    admin.add_view(DepartmentAdmin(Department, db.session, category='Facilities'))
    admin.add_view(AuditLogAdmin(AuditLog, db.session, category='System'))
    admin.add_view(SecureModelView(BackupLog, db.session, category='System'))

    return admin 