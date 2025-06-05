import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.api.app import app, db
from src.api.models import User
from werkzeug.security import generate_password_hash
from setuptools import setup, find_packages

def setup_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create admin user if it doesn't exist
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@medisync.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == '__main__':
    setup_database()

setup(
    name="medisync",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask',
        'Flask-SQLAlchemy',
        'Flask-Migrate',
        'Flask-Login',
        'Flask-Admin',
        'Flask-WTF',
        'Flask-Limiter',
        'Flask-Caching',
        'Flask-Talisman',
        'marshmallow',
        'python-dotenv',
        'cryptography',
        'gunicorn',
    ],
) 