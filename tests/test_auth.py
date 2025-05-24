import pytest
from flask import Flask
from src.api.models.user import User, Role, db
from src.app import create_app
from unittest.mock import patch
from datetime import timedelta

@pytest.fixture
def app():
    from src.app import create_app
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False,
        'JWT_SECRET_KEY': 'test-jwt-secret-key',
        'JWT_ACCESS_TOKEN_EXPIRES': timedelta(minutes=15),
        'JWT_REFRESH_TOKEN_EXPIRES': timedelta(days=30),
        'JWT_TOKEN_LOCATION': ['headers'],
        'JWT_HEADER_NAME': 'Authorization',
        'JWT_HEADER_TYPE': 'Bearer',
        'JWT_ALGORITHM': 'HS256'  # Use simpler algorithm for testing
    })
    
    with app.app_context():
        db.create_all()
        
        # Create roles
        roles = [
            Role('doctor', 'Medical Doctor', {'permissions': ['view_patients', 'edit_records']}),
            Role('nurse', 'Nurse', {'permissions': ['view_patients', 'update_vitals']}),
            Role('admin', 'Administrator', {'permissions': ['manage_users', 'manage_system']}),
            Role('receptionist', 'Receptionist', {'permissions': ['schedule_appointments']})
        ]
        for role in roles:
            if not Role.query.filter_by(name=role.name).first():
                db.session.add(role)
        db.session.commit()
    
    yield app
    
    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    # Register and login a user to get auth tokens
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'Test123!@#',
        'role': 'doctor'
    })
    assert response.status_code == 201
    
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Test123!@#'
    })
    assert response.status_code == 200
    
    tokens = response.get_json()
    return {'Authorization': f'Bearer {tokens["access_token"]}'}

def test_register(client):
    # Test successful registration
    response = client.post('/api/auth/register', json={
        'email': 'doctor@example.com',
        'username': 'doctor1',
        'password': 'Doctor123!@#',
        'role': 'doctor'
    })
    assert response.status_code == 201
    assert 'user' in response.get_json()
    
    # Test duplicate email
    response = client.post('/api/auth/register', json={
        'email': 'doctor@example.com',
        'username': 'doctor2',
        'password': 'Doctor123!@#',
        'role': 'doctor'
    })
    assert response.status_code == 400

def test_login(client):
    # Register a user first
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'Test123!@#',
        'role': 'doctor'
    })
    
    # Test successful login
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Test123!@#'
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()
    assert 'refresh_token' in response.get_json()
    
    # Test invalid credentials
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401

@patch('src.api.services.email_service.EmailService.send_password_reset_email')
def test_password_reset(mock_send_email, client):
    # Register a user first
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'Test123!@#',
        'role': 'doctor'
    })
    
    # Request password reset
    response = client.post('/api/auth/password/reset/request', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 200
    mock_send_email.assert_called_once()
    
    # Test non-existent email
    response = client.post('/api/auth/password/reset/request', json={
        'email': 'nonexistent@example.com'
    })
    assert response.status_code == 200  # Don't reveal if email exists

def test_2fa(client, auth_headers):
    # Enable 2FA
    response = client.post('/api/auth/2fa/enable', headers=auth_headers)
    if response.status_code != 200:
        print(f"2FA Response: {response.get_json()}")
    assert response.status_code == 200
    assert 'secret' in response.get_json()
    
    # Try to enable 2FA again
    response = client.post('/api/auth/2fa/enable', headers=auth_headers)
    assert response.status_code == 400

def test_refresh_token(client):
    # Register and login to get tokens
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'Test123!@#',
        'role': 'doctor'
    })
    
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Test123!@#'
    })
    
    refresh_token = response.get_json()['refresh_token']
    
    # Test token refresh
    response = client.post('/api/auth/refresh', headers={
        'Authorization': f'Bearer {refresh_token}'
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()

def test_audit_logs(client, auth_headers):
    # Perform some actions to generate audit logs
    response = client.post('/api/auth/2fa/enable', headers=auth_headers)
    if response.status_code != 200:
        print(f"2FA Response: {response.get_json()}")

    # Get audit logs
    response = client.get('/api/auth/audit-logs', headers=auth_headers)
    if response.status_code != 200:
        print(f"Audit Logs Response: {response.get_json()}")
    assert response.status_code == 200
    logs = response.get_json()
    assert len(logs) > 0
    
    # Get audit log actions
    response = client.get('/api/auth/audit-logs/actions', headers=auth_headers)
    assert response.status_code == 200
    actions = response.get_json()
    assert len(actions) > 0 