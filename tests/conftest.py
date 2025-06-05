import os
import tempfile
import pytest
from src.api import create_app, db
from src.api.models import User, Hospital

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app('testing')
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'WTF_CSRF_ENABLED': False
    })

    # Create the database and load test data
    with app.app_context():
        db.create_all()
        _load_test_data()

    yield app

    # Clean up
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(app, client):
    """Get auth headers for protected endpoints."""
    with app.app_context():
        # Create a test user
        user = User.query.filter_by(email='test@example.com').first()
        if not user:
            user = User(
                email='test@example.com',
                password='password123',
                first_name='Test',
                last_name='User',
                role='ADMIN'
            )
            db.session.add(user)
            db.session.commit()

        # Login
        response = client.post('/auth/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })
        token = response.json['data']['accessToken']
        
        return {'Authorization': f'Bearer {token}'}

def _load_test_data():
    """Load test data into the database."""
    # Create test user if not exists
    if not User.query.filter_by(email='test@example.com').first():
        user = User(
            email='test@example.com',
            password='password123',
            first_name='Test',
            last_name='User',
            role='ADMIN'
        )
        db.session.add(user)

    # Create test hospital
    if not Hospital.query.filter_by(name='Test Hospital').first():
        hospital = Hospital(
            name='Test Hospital',
            address='123 Test St',
            city='Test City',
            state='TS',
            zip_code='12345',
            phone='123-456-7890',
            capacity=100
        )
        db.session.add(hospital)

    db.session.commit() 