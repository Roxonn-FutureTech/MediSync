"""Admin routes for the MediSync API."""

from flask import Blueprint
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from ..extensions import db, admin
from ..models import User, Hospital

admin_bp = Blueprint('admin', __name__)

# Secure model view that requires authentication
class SecureModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.role == 'admin'

# Register model views
admin.add_view(SecureModelView(User, db.session, category='User Management'))
admin.add_view(SecureModelView(Hospital, db.session, category='Facilities')) 