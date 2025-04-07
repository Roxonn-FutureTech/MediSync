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

## Build Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev
```

### Production Build
```bash
# Create production build
npm run build

# The build artifacts will be stored in the `dist/` directory
```

### Preview Production Build
```bash
# Preview the production build locally
npm run preview
```

### Additional Scripts
```bash
# Run linting
npm run lint

# Generate icons
npm run generate-icons
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── theme/         # Theme configuration
│   └── utils/         # Utility functions
├── public/           # Static assets
└── dist/            # Build output (generated)
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

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/yourusername/MediSync](https://github.com/yourusername/MediSync)

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=your_api_url
```
