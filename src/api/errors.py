"""Error handling module for the MediSync API."""

from flask import jsonify, request
from marshmallow import ValidationError
import logging

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    """Register error handlers with the Flask application.
    
    Args:
        app: Flask application instance
    """
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        """Handle Marshmallow validation errors."""
        return jsonify({
            'error': 'Validation Error',
            'message': error.messages,
            'status_code': 400
        }), 400

    @app.errorhandler(400)
    def handle_bad_request(error):
        """Handle bad request errors."""
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description),
            'status_code': 400
        }), 400

    @app.errorhandler(401)
    def handle_unauthorized(error):
        """Handle unauthorized access errors."""
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication is required to access this resource',
            'status_code': 401
        }), 401

    @app.errorhandler(403)
    def handle_forbidden(error):
        """Handle forbidden access errors."""
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource',
            'status_code': 403
        }), 403

    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle resource not found errors."""
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found',
            'status_code': 404
        }), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        """Handle method not allowed errors."""
        return jsonify({
            'error': 'Method Not Allowed',
            'message': f'The method {request.method} is not allowed for this endpoint',
            'status_code': 405
        }), 405

    @app.errorhandler(429)
    def handle_rate_limit_exceeded(error):
        """Handle rate limit exceeded errors."""
        return jsonify({
            'error': 'Rate Limit Exceeded',
            'message': 'Too many requests. Please try again later.',
            'status_code': 429
        }), 429

    @app.errorhandler(500)
    def handle_internal_server_error(error):
        """Handle internal server errors."""
        logger.error(f"Internal Server Error: {str(error)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Handle any unhandled exceptions."""
        logger.error(f"Unexpected Error: {str(error)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500 