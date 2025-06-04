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

## Tech Stack

### Backend
- Python 3.8+
- Flask
- SQLAlchemy
- Flask-Admin
- Flask-Login
- Flask-Limiter
- Flask-Caching

### Frontend
- React 18
- TypeScript
- Material-UI
- Chart.js
- Leaflet
- Vite

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
python init_db.py
```

4. Start the backend server:
```bash
flask run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URI=sqlite:///./instance/emergency_portal.db
```

## API Documentation

API documentation is available at `/docs` when running the backend server.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please email security@medisync.com
