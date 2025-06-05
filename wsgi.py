"""WSGI entry point for the MediSync application.

This module creates and configures the Flask application using the
application factory pattern.
"""

import os
from medisync import create_app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    app.run() 