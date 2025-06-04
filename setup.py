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
    version="1.0.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask>=2.3.3',
        'Flask-SQLAlchemy>=3.1.1',
        'Flask-Limiter>=3.5.0',
        'Flask-Caching>=2.1.0',
        'Flask-WTF>=1.2.1',
        'marshmallow>=3.20.1',
        'cryptography>=41.0.4',
        'python-dotenv>=1.0.0',
        'redis>=5.0.1',
        'gunicorn>=21.2.0',
        'SQLAlchemy>=2.0.22',
        'Werkzeug>=2.3.7',
        'psycopg2-binary>=2.9.9',
        'python-jose>=3.3.0',
        'PyJWT>=2.8.0',
        'requests>=2.31.0',
    ],
    python_requires='>=3.8',
    entry_points={
        'console_scripts': [
            'medisync=src.api.app:main',
        ],
    },
) 