# MediSync Frontend

A modern, responsive Progressive Web Application (PWA) for emergency medical response and hospital coordination.

## Features

### Dashboard
- Real-time emergency monitoring with interactive statistics
- Live response time tracking and trend analysis
- Staff availability and status monitoring
- Hospital occupancy visualization
- Emergency case management with severity indicators
- Interactive charts for data visualization
- System status monitoring with key metrics

### Hospital Management
- Comprehensive hospital listing with multiple view options (Card, Table, Map)
- Real-time bed availability tracking
- Department and specialty filtering
- Interactive map view with hospital locations
- Detailed hospital information cards
- Quick actions for emergency coordination
- Advanced search and filtering capabilities

### Emergency Response
- Active emergency case tracking
- Severity-based prioritization
- Real-time status updates
- Staff assignment management
- Response time monitoring
- Location-based emergency routing
- Incident reporting and documentation

### Staff Management
- Staff availability tracking
- Role-based access control
- Shift management
- Expertise and specialty tracking
- Real-time status updates
- Performance metrics
- Quick communication tools

### Settings & Configuration
- User preferences management
- System configuration
- Notification settings
- Theme customization
- Language preferences
- Integration settings
- Access control management

## Technical Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Data Visualization**: Chart.js with react-chartjs-2
- **Maps**: Leaflet with react-leaflet
- **PWA Support**: Vite PWA plugin
- **Build Tool**: Vite
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MediSync.git
   cd MediSync/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Development

The project follows a modular architecture with the following structure:

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── routes/        # Routing configuration
│   ├── styles/        # Global styles and themes
│   ├── assets/        # Static assets
│   └── utils/         # Utility functions
├── public/            # Public assets
└── vite.config.ts     # Vite configuration
```

## Progressive Web App Features

- Offline support with service workers
- Installable on mobile devices
- Push notifications
- Background sync
- Responsive design for all devices
- App-like experience

## Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Minimized bundle size
- Optimized assets
- Performance monitoring

## Security Features

- HTTPS enforcement
- Secure data transmission
- Input validation
- Authentication and authorization
- Session management
- API security
- Data encryption

## Accessibility

- WCAG 2.1 compliance
- Screen reader support
- Keyboard navigation
- Color contrast compliance
- Focus management
- Semantic HTML
- ARIA attributes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/yourusername/MediSync](https://github.com/yourusername/MediSync)
