import os
from src.api.app import app
from src.api.config.production import ProductionConfig

# Load production configuration
if os.getenv('FLASK_ENV') == 'production':
    app.config.from_object(ProductionConfig)

if __name__ == '__main__':
    # Initialize database
    with app.app_context():
        from src.api.app import db
        db.create_all()
    
    # Run with gunicorn in production
    if os.getenv('FLASK_ENV') == 'production':
        from gunicorn.app.base import BaseApplication

        class StandaloneApplication(BaseApplication):
            def __init__(self, app, options=None):
                self.options = options or {}
                self.application = app
                super().__init__()

            def load_config(self):
                for key, value in self.options.items():
                    self.cfg.set(key, value)

            def load(self):
                return self.application

        options = {
            'bind': '0.0.0.0:8000',
            'workers': 4,
            'worker_class': 'sync',
            'timeout': 120,
            'keepalive': 5,
            'ssl_version': 'TLS',
            'certfile': app.config['SSL_CERT_PATH'],
            'keyfile': app.config['SSL_KEY_PATH'],
            'accesslog': 'logs/access.log',
            'errorlog': 'logs/error.log',
            'loglevel': 'info'
        }

        StandaloneApplication(app, options).run()
    else:
        # Development server
        app.run(ssl_context=('certs/cert.pem', 'certs/key.pem')) 