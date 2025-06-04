from src.api.app import db, app
from src.api.utils.encryption import EncryptionService
import logging
import os

logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with required tables and initial data"""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            logger.info("Database tables created successfully")

            # Generate encryption key if not exists
            if not os.getenv('DATABASE_ENCRYPTION_KEY'):
                encryption_service = EncryptionService()
                new_key = encryption_service.generate_key()
                logger.info("New encryption key generated. Please set this in your environment variables:")
                logger.info(f"DATABASE_ENCRYPTION_KEY={new_key}")

            # Verify database connection
            db.session.execute('SELECT 1')
            logger.info("Database connection verified")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

def reset_db():
    """Reset the database by dropping all tables and recreating them"""
    try:
        with app.app_context():
            # Drop all tables
            db.drop_all()
            logger.info("All database tables dropped")

            # Recreate tables
            init_db()
            logger.info("Database reset completed successfully")

    except Exception as e:
        logger.error(f"Error resetting database: {str(e)}")
        raise

if __name__ == '__main__':
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Initialize or reset database based on command line argument
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reset_db()
    else:
        init_db() 