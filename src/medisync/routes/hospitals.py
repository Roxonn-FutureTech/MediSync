from flask import request, jsonify
from medisync import db
from medisync.models.hospital import Hospital

def register_routes(app):
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
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/hospitals', methods=['GET'])
    def get_hospitals():
        try:
            hospitals = Hospital.query.all()
            return jsonify([{
                'id': h.id,
                'name': h.name,
                'address': h.address,
                'phone': h.phone,
                'capacity': h.capacity
            } for h in hospitals]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500 