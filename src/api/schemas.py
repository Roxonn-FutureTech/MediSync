"""Marshmallow schemas for serialization and validation.

This module contains the schema definitions for serializing and deserializing
data models in the MediSync application.
"""

from marshmallow import Schema, fields, validate

class HospitalSchema(Schema):
    """Schema for Hospital model serialization and validation."""
    
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=256))
    address = fields.Str(required=True, validate=validate.Length(min=1, max=512))
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=32))
    capacity = fields.Int(required=True, validate=validate.Range(min=1))
    current_occupancy = fields.Int()
    emergency_capacity = fields.Int(required=True, validate=validate.Range(min=1))
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ErrorSchema(Schema):
    """Schema for error response serialization."""
    
    error = fields.Str(required=True)
    message = fields.Str(required=True)
    status_code = fields.Int(required=True) 