"""MediSync API application module.

This module serves as the entry point for running the application directly.
For proper application factory usage, import create_app from the package root.
"""

from . import create_app

app = create_app()

def main():
    """Main entry point for the application when run directly."""
    ssl_context = ('certs/cert.pem', 'certs/key.pem')
    app.run(debug=False, ssl_context=ssl_context)

if __name__ == '__main__':
    main()