import pytest
import sys
import os
from pathlib import Path

# Add the src directory to the Python path
src_path = str(Path(__file__).parent.parent / 'src')
if src_path not in sys.path:
    sys.path.insert(0, src_path)

from medisync import create_app, db
from medisync.models.hospital import Hospital

@pytest.fixture
def app():
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_database(app):
    with app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()

def test_register_hospital(client, init_database):
    response = client.post('/api/hospitals', json={
        'name': 'Test Hospital',
        'address': '123 Test St',
        'phone': '123-456-7890',
        'capacity': 100
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Test Hospital'
    assert data['address'] == '123 Test St'
    assert data['phone'] == '123-456-7890'
    assert data['capacity'] == 100

def test_register_hospital_missing_data(client, init_database):
    response = client.post('/api/hospitals', json={
        'name': 'Test Hospital',
        'address': '123 Test St'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_get_hospitals(client, init_database, app):
    # Add a test hospital
    test_hospital = Hospital(
        name='Test Hospital',
        address='123 Test St',
        phone='123-456-7890',
        capacity=100
    )
    with app.app_context():
        db.session.add(test_hospital)
        db.session.commit()

    response = client.get('/api/hospitals')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'Test Hospital' 