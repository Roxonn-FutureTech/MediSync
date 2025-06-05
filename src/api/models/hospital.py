"""Hospital model for the MediSync API."""

from ..extensions import db

class Hospital(db.Model):
    """Hospital model representing medical facilities in the system."""
    
    __tablename__ = 'hospitals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    emergency_capacity = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        """Return string representation of the hospital."""
        return f'<Hospital {self.name}>' 