from src.api.app import app, db
from src.api.models import User
from werkzeug.security import generate_password_hash

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin exists
        if not User.query.filter_by(username='admin').first():
            # Create admin user
            admin = User(
                username='admin',
                email='admin@medisync.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == '__main__':
    init_db() 