from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_security import Security, SQLAlchemyUserDatastore
from .api.models.user import db, User, Role
from .api.routes.auth import auth_bp
from .api.services.email_service import mail
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        if isinstance(user, dict):
            return str(user.get('id'))
        return str(user)
    
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"] if "sub" in jwt_data else jwt_data.get("user_id")
        if identity:
            try:
                user_id = int(identity)
                return User.query.filter_by(id=user_id).one_or_none()
            except (ValueError, TypeError):
                return None
        return None
    
    mail.init_app(app)
    
    # Setup Flask-Security
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    Security(app, user_datastore)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True) 