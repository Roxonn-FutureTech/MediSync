import pytest
from flask import url_for
from src.api.models.user import User, Role, db
from src.api.services.auth_service import AuthService

@pytest.fixture
def app():
    from src.app import create_app
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        
        # Create test roles
        roles = [
            Role('doctor', 'Medical Doctor', {'permissions': ['view_patients', 'edit_patients']}),
            Role('nurse', 'Nurse', {'permissions': ['view_patients']}),
            Role('admin', 'Administrator', {'permissions': ['admin_access']}),
            Role('receptionist', 'Receptionist', {'permissions': ['view_appointments']})
        ]
        for role in roles:
            db.session.add(role)
        db.session.commit()
        
    yield app
    
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    # Register and login a test user
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
    
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}

def test_register(client):
    # Test successful registration
    response = client.post('/api/auth/register', json={
        'email': 'doctor@example.com',
        'username': 'doctor1',
        'password': 'Doctor123!@#',
        'role': 'doctor'
    })
    assert response.status_code == 201
    assert 'user' in response.json
    assert response.json['user']['email'] == 'doctor@example.com'
    assert response.json['user']['role'] == 'doctor'
    
    # Test duplicate email
    response = client.post('/api/auth/register', json={
        'email': 'doctor@example.com',
        'username': 'doctor2',
        'password': 'Doctor123!@#',
        'role': 'doctor'
    })
    assert response.status_code == 400
    assert 'error' in response.json
    assert 'already registered' in response.json['error']
    
    # Test invalid role
    response = client.post('/api/auth/register', json={
        'email': 'new@example.com',
        'username': 'newuser',
        'password': 'Test123!@#',
        'role': 'invalid_role'
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
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json
    
    # Test invalid credentials
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'wrong_password'
    })
    assert response.status_code == 401
    assert 'error' in response.json

def test_2fa(client, auth_headers):
    # Enable 2FA
    response = client.post('/api/auth/2fa/enable', headers=auth_headers)
    assert response.status_code == 200
    assert 'secret' in response.json
    
    # Try to enable 2FA again
    response = client.post('/api/auth/2fa/enable', headers=auth_headers)
    assert response.status_code == 400
    assert 'already enabled' in response.json['error']
    
    # Test login with 2FA
    secret = response.json['secret']
    token = AuthService.generate_2fa_token(secret)
    
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Test123!@#'
    })
    assert response.status_code == 200
    assert response.json['requires_2fa'] is True
    
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Test123!@#',
        'two_factor_token': token
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_password_reset(client):
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
    
    # Get the reset token from the database
    with client.application.app_context():
        user = User.query.filter_by(email='test@example.com').first()
        token = user.reset_password_token
    
    # Reset password
    response = client.post('/api/auth/password/reset/verify', json={
        'token': token,
        'new_password': 'NewTest123!@#'
    })
    assert response.status_code == 200
    
    # Try to login with new password
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'NewTest123!@#'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_refresh_token(client):
    # Register and login
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
    refresh_token = response.json['refresh_token']
    
    # Test token refresh
    response = client.post('/api/auth/refresh', json={
        'refresh_token': refresh_token
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json
    
    # Test invalid refresh token
    response = client.post('/api/auth/refresh', json={
        'refresh_token': 'invalid_token'
    })
    assert response.status_code == 401
    assert 'error' in response.json

def test_audit_logs(client, auth_headers):
    # Perform some actions to generate audit logs
    client.post('/api/auth/2fa/enable', headers=auth_headers)
    client.post('/api/auth/password/reset/request', json={
        'email': 'test@example.com'
    })
    
    # Get audit logs
    response = client.get('/api/auth/audit-logs', headers=auth_headers)
    assert response.status_code == 200
    assert 'logs' in response.json
    assert len(response.json['logs']) > 0
    
    # Test filtering
    response = client.get('/api/auth/audit-logs?action=2FA_ENABLE', headers=auth_headers)
    assert response.status_code == 200
    assert all(log['action'] == '2FA_ENABLE' for log in response.json['logs'])
    
    # Test pagination
    response = client.get('/api/auth/audit-logs?page=1&per_page=2', headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json['logs']) <= 2
    assert 'total' in response.json
    assert 'pages' in response.json
    assert 'current_page' in response.json 