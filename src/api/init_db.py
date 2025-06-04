"""Database initialization script.

This module provides functions to initialize the database with default data
and create necessary tables for the MediSync application.
"""

from werkzeug.security import generate_password_hash
from .app import app
from .models import User, Hospital, db

def init_db():
    """Initialize the database with default data.
    
    Creates tables and adds default admin user and hospital if they don't exist.
    """
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@medisync.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
        
        # Check if default hospital exists
        hospital = Hospital.query.filter_by(name='MediSync General Hospital').first()
        if not hospital:
            hospital = Hospital(
                name='MediSync General Hospital',
                address='123 Healthcare Ave, Medical District',
                phone='+1-555-0123',
                capacity=500,
                emergency_capacity=50,
                is_active=True
            )
            db.session.add(hospital)
        
        db.session.commit()

if __name__ == '__main__':
    init_db() 