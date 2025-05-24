# MediSync Authentication System

A secure authentication system for medical professionals and administrators.

## Features

- JWT-based authentication
- Role-based access control
- Two-factor authentication (2FA)
- Password reset functionality
- Secure session management
- Comprehensive audit logging
- CORS protection

## Tech Stack

### Backend
- Python 3.11+
- Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Security-Too
- Flask-Mail
- PyOTP for 2FA

### Frontend
- React 18
- TypeScript
- Material-UI
- Formik & Yup
- Axios
- React Router

## Setup

### Backend Setup

1. Create and activate virtual environment:
   ```bash
   cd src
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL if needed

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/password/reset/request` - Request password reset
- `POST /api/auth/password/reset/verify` - Reset password

## Security Features

1. **Password Security**
   - Bcrypt hashing
   - Minimum length requirement
   - Complexity requirements

2. **Two-Factor Authentication**
   - TOTP-based (Time-based One-Time Password)
   - QR code for easy setup
   - Backup codes support

3. **Session Management**
   - JWT with refresh tokens
   - Token expiration
   - Secure cookie handling

4. **Audit Logging**
   - Login attempts
   - Password changes
   - 2FA operations
   - Security-related actions

## Development

### Running Tests
```bash
# Backend tests
cd src
python -m pytest

# Frontend tests
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Maintainer: [Your Name]
Email: [your.email@example.com]
Project Link: [https://github.com/yourusername/MediSync](https://github.com/yourusername/MediSync)

## Acknowledgments

- Emergency medical professionals for their input and feedback
- Open source community for various tools and libraries
- Contributors and testers
# emergency-med-portal 
