# MediSync

MediSync is a comprehensive Emergency Medical Services Portal that helps coordinate and manage emergency medical responses, hospital resources, and patient care.

## Features

- Real-time emergency response coordination
- Hospital resource management
- Patient tracking and medical history
- Staff management and scheduling
- Analytics and reporting
- Interactive map visualization
- PWA support for mobile access

## Project Structure

```
MediSync/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route definitions
│   │   └── styles/        # Global styles
│   ├── public/            # Public assets
│   └── vite.config.ts     # Vite configuration
├── src/                    # Backend Python application
│   └── api/
│       ├── config/        # Configuration modules
│       ├── models/        # Database models
│       ├── routes/        # API routes
│       ├── middleware/    # Custom middleware
│       └── utils/         # Utility functions
├── tests/                 # Test suites
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── migrations/            # Database migrations
├── instance/             # Instance-specific files
├── logs/                 # Application logs
└── certs/                # SSL certificates
```

## Tech Stack

### Backend
- Python 3.8+
- Flask
- SQLAlchemy
- PostgreSQL
- Redis
- Gunicorn

### Frontend
- React 18
- TypeScript
- Material-UI
- Chart.js
- Leaflet
- Vite

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Python 3.8+
- Node.js 18+
- npm or yarn

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medisync.git
cd medisync
```

2. Create and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development environment:
```bash
# Using Docker
docker-compose up -d

# Without Docker - Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run

# Without Docker - Frontend
cd frontend
npm install
npm run dev
```

### Production Deployment

1. Build and start the containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. Initialize the database:
```bash
docker-compose exec backend flask db upgrade
```

## Configuration

The application uses a hierarchical configuration system:

- `Config`: Base configuration
- `DevelopmentConfig`: Development settings
- `TestingConfig`: Testing settings
- `ProductionConfig`: Production settings

Configuration is loaded based on the `FLASK_ENV` environment variable.

## Testing

```bash
# Backend tests
pytest

# Frontend tests
cd frontend && npm test
```

## Logging

Logs are stored in the `logs` directory:
- `app.log`: Application logs
- `access.log`: HTTP access logs
- `error.log`: Application error logs
- `security.log`: Security-related events

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please email security@medisync.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
