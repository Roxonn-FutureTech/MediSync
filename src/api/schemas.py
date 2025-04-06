from marshmallow import Schema, fields, validate

class HospitalSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    address = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    phone = fields.Str(required=True, validate=validate.Regexp(r'^\+?1?\d{9,15}$'))
    capacity = fields.Int(required=True, validate=validate.Range(min=1))
    created_at = fields.DateTime(dump_only=True)

class ErrorSchema(Schema):
    error = fields.Str(required=True)
    message = fields.Str(required=True)
    status_code = fields.Int(required=True) 