from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

@app.route('/api/hospitals', methods=['POST'])
def register_hospital():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400

    # Validate required fields
    required_fields = ['name', 'address', 'phone', 'capacity']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        hospital = Hospital(
            name=data['name'],
            address=data['address'],
            phone=data['phone'],
            capacity=data['capacity']
        )
        db.session.add(hospital)
        db.session.commit()

        return jsonify({
            'id': hospital.id,
            'name': hospital.name,
            'address': hospital.address,
            'phone': hospital.phone,
            'capacity': hospital.capacity
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
