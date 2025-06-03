# MediSync - Emergency Medical Services Portal

A secure, HIPAA-compliant emergency medical services portal built with Flask and React.

## Features

- 🔒 HIPAA-compliant security measures
- 🏥 Hospital management system
- 🚑 Emergency response coordination
- 📊 Real-time monitoring
- 🗺️ Geographic mapping
- 👥 Staff management
- 📱 Progressive Web App (PWA)

## Security Features

- End-to-end encryption
- SSL/TLS encryption
- Secure session handling
- CSRF protection
- XSS protection
- SQL injection prevention
- Audit logging
- Password policy enforcement
- Data encryption at rest

## Prerequisites

- Python 3.8+
- Node.js 14+
- OpenSSL
- SQLite (for development) or PostgreSQL (for production)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medisync.git
cd medisync
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

5. Create necessary directories:
```bash
mkdir -p logs certs instance
```

6. Generate SSL certificates (for development):
```bash
python scripts/generate_cert.py
```

7. Create a `.env` file and configure your environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

8. Initialize the database:
```bash
flask db upgrade
```

## Running the Application

1. Start the backend server:
```bash
flask run --cert=certs/cert.pem --key=certs/key.pem
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at `https://localhost:5000`

## Development

- Backend API: `src/api/`
- Frontend: `frontend/src/`
- Database migrations: `migrations/`
- Configuration: `src/api/config/`
- Tests: `tests/`

## Testing

Run the test suite:
```bash
python -m pytest
```

Test the API endpoints:
```bash
python scripts/test_api.py
```

## Security Considerations

1. Replace all default keys and secrets in production
2. Use proper SSL certificates in production
3. Configure proper firewall rules
4. Regular security audits
5. Monitor logs for suspicious activity

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Emergency medical professionals for their input and feedback
- Open source community for various tools and libraries
- Contributors and testers
