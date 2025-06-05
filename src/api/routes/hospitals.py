"""Hospital-related routes for the MediSync API."""

from flask import Blueprint, jsonify, request, abort
from flask_login import login_required
from marshmallow import ValidationError
from ..models import Hospital
from ..schemas import HospitalSchema
from ..extensions import db, limiter, cache
from ..middleware.security import require_ssl, validate_content_type, audit_log
import logging

hospitals_bp = Blueprint('hospitals', __name__)
logger = logging.getLogger(__name__)

@hospitals_bp.route('/hospitals', methods=['POST'])
@require_ssl
@validate_content_type
@limiter.limit("10 per minute")
@audit_log('hospital_creation')
def register_hospital():
    """Register a new hospital in the system."""
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({
                'error': 'Invalid JSON',
                'message': 'No JSON data provided',
                'status_code': 400
            }), 400
        
        schema = HospitalSchema()
        data = schema.load(json_data)
        new_hospital = Hospital(
            name=data['name'],
            address=data['address'],
            phone=data['phone'],
            capacity=data['capacity']
        )
        db.session.add(new_hospital)
        db.session.commit()
        return jsonify(schema.dump(new_hospital)), 201
    except ValidationError as e:
        return jsonify({
            'error': 'Validation Error',
            'message': e.messages,
            'status_code': 400
        }), 400
    except Exception as e:
        logger.error("Error in register_hospital: %s", str(e))
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500

@hospitals_bp.route('/hospitals', methods=['GET'])
@require_ssl
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
@audit_log('hospitals_list')
def get_hospitals():
    """Get a list of all hospitals."""
    hospitals = Hospital.query.all()
    schema = HospitalSchema(many=True)
    return jsonify(schema.dump(hospitals)), 200

@hospitals_bp.route('/hospitals/<int:hospital_id>', methods=['GET'])
@require_ssl
@cache.cached(timeout=60)
@limiter.limit("30 per minute")
@audit_log('hospital_view')
def get_hospital(hospital_id):
    """Get details of a specific hospital."""
    hospital = Hospital.query.get_or_404(hospital_id)
    schema = HospitalSchema()
    return jsonify(schema.dump(hospital)), 200

@hospitals_bp.route('/hospitals/<int:hospital_id>', methods=['PUT'])
@require_ssl
@validate_content_type
@limiter.limit("10 per minute")
@audit_log('hospital_update')
def update_hospital(hospital_id):
    """Update a hospital's information."""
    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({
                'error': 'Invalid JSON',
                'message': 'No JSON data provided',
                'status_code': 400
            }), 400
        
        hospital = Hospital.query.get_or_404(hospital_id)
        schema = HospitalSchema()
        data = schema.load(json_data)
        
        hospital.name = data['name']
        hospital.address = data['address']
        hospital.phone = data['phone']
        hospital.capacity = data['capacity']
        db.session.commit()
        return jsonify(schema.dump(hospital)), 200
    except ValidationError as e:
        return jsonify({
            'error': 'Validation Error',
            'message': e.messages,
            'status_code': 400
        }), 400
    except Exception as e:
        logger.error(f"Error in update_hospital: {str(e)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An error occurred while processing your request',
            'status_code': 500
        }), 500

@hospitals_bp.route('/hospitals/<int:hospital_id>', methods=['DELETE'])
@require_ssl
@limiter.limit("10 per minute")
@audit_log('hospital_deletion')
def delete_hospital(hospital_id):
    """Delete a hospital from the system."""
    hospital = Hospital.query.get_or_404(hospital_id)
    db.session.delete(hospital)
    db.session.commit()
    return '', 204 