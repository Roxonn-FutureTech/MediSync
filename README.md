# MediSync - Emergency Medical Response System

MediSync is a comprehensive emergency medical response and hospital coordination system designed to streamline emergency response operations and improve patient care outcomes. 

## Project Overview

MediSync is built to address the critical need for efficient emergency medical response coordination. The system connects hospitals, emergency responders, and medical staff in real-time, enabling faster response times and better resource allocation.

## Key Features

### Real-time Emergency Response
- Instant emergency case tracking and management
- Automated resource allocation
- Real-time status updates and notifications
- GPS-based routing and navigation

### Hospital Coordination
- Live bed availability tracking
- Department and specialty management
- Resource sharing between facilities
- Patient transfer coordination

### Staff Management
- Real-time staff availability tracking
- Shift management and scheduling
- Expertise-based assignment
- Performance monitoring

### Analytics and Reporting
- Response time analytics
- Resource utilization reports
- Performance metrics
- Trend analysis and predictions

## System Architecture

The project is structured into two main components:

### Frontend (/frontend)
- Modern Progressive Web Application (PWA)
- Built with React, TypeScript, and Material-UI
- Real-time updates and offline support
- Responsive design for all devices
- See [Frontend README](frontend/README.md) for details
- See [Frontend architecture notes](docs/frontend_architecture.md) for routing, providers, and folder responsibilities

### Backend (`src/api`)
- Flask REST API service
- SQLAlchemy models backed by a local SQLite database
- Marshmallow request/response validation
- JSON error handlers and rate limiting
- API documentation served from `docs/API.md`

## Technology Stack

### Frontend
- React 18 with TypeScript
- Material-UI v5
- Chart.js for data visualization
- Leaflet for mapping
- PWA capabilities

### Backend
- Python 3
- Flask
- Flask-SQLAlchemy
- SQLite
- Marshmallow
- Flask-Limiter
- Flask-Caching

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MediSync.git
   cd MediSync
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Set up the backend:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   python -m src.api.app
   ```

   The development database is created automatically in Flask's `instance/`
   folder as `emergency_portal.db`. Override it with `DATABASE_URI` when a
   different database location is needed.

4. Run backend tests:
   ```bash
   python -m unittest discover -s tests
   ```

## Development Roadmap

### Phase 1 - Frontend Development (Current)
- [x] Project setup and configuration
- [x] UI component development
- [x] PWA implementation
- [x] Real-time updates
- [ ] Testing and optimization

### Phase 2 - Backend Development
- [x] API foundation
- [x] Local SQLite setup
- [ ] Authentication system
- [ ] Real-time communication
- [ ] Testing and documentation

### Phase 3 - Integration and Enhancement
- [ ] Frontend-backend integration
- [ ] Performance optimization
- [ ] Security hardening
- [ ] User acceptance testing
- [ ] Deployment preparation

## Contributing

We welcome contributions to the MediSync project! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Maintainer: [Your Name]
Email: [your.email@example.com]
Project Link: [https://github.com/yourusername/MediSync](https://github.com/yourusername/MediSync)

## Acknowledgments

- Emergency medical professionals for their input and feedback
- Open source community for various tools and libraries
- Contributors and testers
# emergency-med-portal 
