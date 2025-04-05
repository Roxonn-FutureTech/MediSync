import unittest
import json
from src.api.app import app, db, Hospital

class TestAPI(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        self.client = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()

    def test_register_hospital(self):
        response = self.client.post('/api/hospitals',
                                    data=json.dumps({
                                        'name': 'Test Hospital',
                                        'address': '123 Test St',
                                        'phone': '123-456-7890',
                                        'capacity': 100
                                    }),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['name'], 'Test Hospital')
        self.assertEqual(data['capacity'], 100)

if __name__ == '__main__':
    unittest.main()