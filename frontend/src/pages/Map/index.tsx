import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  alpha,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  CircularProgress,
  Stack,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Rating,
  Avatar,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FilterList as FilterListIcon,
  LocalHospital as HospitalIcon,
  DirectionsRun as EmergencyIcon,
  DirectionsCar as AmbulanceIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  MedicalServices as ClinicIcon,
  Layers as LayersIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Replace react-map-gl with react-leaflet
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import * as turf from '@turf/turf';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon problem
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const theme = useTheme();
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['hospitals', 'emergencies', 'clinics']);
  const [mapStyle, setMapStyle] = useState('streets');
  const [center, setCenter] = useState<[number, number]>([34.0522, -118.2437]);
  const [zoom, setZoom] = useState(11);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const mapRef = useRef<L.Map>(null);
  
  // Mock facility details with expanded information
  const facilityDetails = {
    'Central Hospital': {
      address: '123 Main Street, Los Angeles, CA 90001',
      phone: '(213) 555-1234',
      hours: '24/7',
      beds: { total: 450, available: 72 },
      emergencyWait: '25 minutes',
      departments: ['Emergency', 'Surgery', 'ICU', 'Radiology', 'Cardiology', 'Neurology', 'Oncology'],
      rating: 4.7,
      services: ['MRI', 'CT Scan', 'X-Ray', 'Blood Tests', 'Surgery', 'Intensive Care'],
      description: 'A state-of-the-art medical facility offering comprehensive healthcare services with advanced technology and specialized departments.',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    'Emergency Medical Center': {
      address: '456 Oak Avenue, Los Angeles, CA 90007',
      phone: '(213) 555-5678',
      hours: '24/7',
      beds: { total: 120, available: 18 },
      emergencyWait: '45 minutes',
      departments: ['Emergency', 'Trauma', 'Critical Care', 'Radiology'],
      rating: 4.2,
      services: ['Trauma Care', 'Emergency Surgery', 'Critical Care', 'Diagnostic Imaging'],
      description: 'Specialized center focused on emergency and critical care services with rapid response capabilities for urgent medical situations.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    'Northern Clinic': {
      address: '789 Pine Boulevard, Los Angeles, CA 90015',
      phone: '(213) 555-9101',
      hours: '8:00 AM - 8:00 PM',
      beds: { total: 50, available: 23 },
      emergencyWait: 'N/A',
      departments: ['Family Medicine', 'Pediatrics', 'Internal Medicine', 'Obstetrics'],
      rating: 4.5,
      services: ['Preventive Care', 'Vaccinations', 'Health Screenings', 'Chronic Disease Management'],
      description: 'Community-focused clinic providing primary care services for individuals and families, with an emphasis on preventive medicine.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    'Westside Medical Plaza': {
      address: '321 Coast Highway, Los Angeles, CA 90292',
      phone: '(213) 555-1122',
      hours: '7:00 AM - 9:00 PM',
      beds: { total: 200, available: 45 },
      emergencyWait: '30 minutes',
      departments: ['Emergency', 'Orthopedics', 'Cardiology', 'Neurology', 'Gastroenterology'],
      rating: 4.6,
      services: ['Orthopedic Surgery', 'Cardiac Care', 'Stroke Treatment', 'Diagnostic Imaging'],
      description: 'Modern medical complex combining emergency services with specialized care departments and advanced diagnostic capabilities.',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    'Eastside Community Hospital': {
      address: '654 Elm Street, Los Angeles, CA 90023',
      phone: '(213) 555-3344',
      hours: '24/7',
      beds: { total: 150, available: 22 },
      emergencyWait: '55 minutes',
      departments: ['Emergency', 'Pediatrics', 'Obstetrics', 'General Surgery'],
      rating: 4.0,
      services: ['Maternity Care', 'Pediatric Services', 'Women\'s Health', 'General Surgery'],
      description: 'Community hospital serving the eastern neighborhoods with a focus on maternal and child health services.',
      image: 'https://images.unsplash.com/photo-1578991624414-276ef23a2e5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    'Southern Urgent Care': {
      address: '987 Maple Drive, Los Angeles, CA 90011',
      phone: '(213) 555-5566',
      hours: '9:00 AM - 10:00 PM',
      beds: { total: 30, available: 12 },
      emergencyWait: '15 minutes',
      departments: ['Urgent Care', 'Primary Care'],
      rating: 4.3,
      services: ['Urgent Care', 'Minor Emergency Treatment', 'X-Ray', 'Lab Tests'],
      description: 'Urgent care facility providing fast treatment for non-life-threatening conditions with shorter wait times than emergency rooms.',
      image: 'https://images.unsplash.com/photo-1631217868264-e6036a8d6a4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
  };

  // Enhanced hospital data with more facilities and locations
  const facilities = [
    { id: 1, name: 'Central Hospital', type: 'hospital', status: 'active', latitude: 34.0522, longitude: -118.2437, capacity: 95 },
    { id: 2, name: 'Emergency Medical Center', type: 'emergency', status: 'active', latitude: 34.0622, longitude: -118.2537, capacity: 85 },
    { id: 3, name: 'Northern Clinic', type: 'clinic', status: 'active', latitude: 34.0722, longitude: -118.2637, capacity: 50 },
    { id: 4, name: 'Westside Medical Plaza', type: 'hospital', status: 'active', latitude: 34.0322, longitude: -118.4937, capacity: 78 },
    { id: 5, name: 'Eastside Community Hospital', type: 'hospital', status: 'caution', latitude: 34.0422, longitude: -118.1837, capacity: 65 },
    { id: 6, name: 'Southern Urgent Care', type: 'clinic', status: 'active', latitude: 34.0822, longitude: -118.2237, capacity: 90 },
    { id: 7, name: 'Mobile Emergency Unit #1', type: 'emergency', status: 'active', latitude: 34.0472, longitude: -118.3037, capacity: 100 },
    { id: 8, name: 'Mobile Emergency Unit #2', type: 'emergency', status: 'caution', latitude: 34.0922, longitude: -118.2737, capacity: 75 },
    { id: 9, name: 'Downtown Clinic', type: 'clinic', status: 'inactive', latitude: 34.0402, longitude: -118.2387, capacity: 40 },
    { id: 10, name: 'Harbor Medical Center', type: 'hospital', status: 'active', latitude: 34.0792, longitude: -118.2037, capacity: 92 },
  ];

  // Ambulance data
  const ambulances = [
    { id: 101, name: 'Ambulance Unit #1', status: 'active', latitude: 34.0550, longitude: -118.2500, inTransit: false, destination: 'Central Hospital' },
    { id: 102, name: 'Ambulance Unit #2', status: 'active', latitude: 34.0650, longitude: -118.2600, inTransit: true, destination: 'Emergency Medical Center' },
    { id: 103, name: 'Ambulance Unit #3', status: 'active', latitude: 34.0450, longitude: -118.2700, inTransit: false, destination: null },
    { id: 104, name: 'Ambulance Unit #4', status: 'inactive', latitude: 34.0750, longitude: -118.2400, inTransit: false, destination: null },
  ];

  useEffect(() => {
    // Simulate loading map resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle facility in favorites
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fid => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Handle facility click
  const handleFacilityClick = (facility: any) => {
    setSelectedFacility(facility);
    setFacilityDialogOpen(true);
  };

  // Change map style
  const handleMapStyleChange = (style: string) => {
    setMapStyle(style);
  };

  // Toggle filter
  const handleFilterToggle = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Handle filter change with multiple selection
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: string[],
  ) => {
    if (newFilters.length) {
      setActiveFilters(newFilters);
    }
  };

  // Update zoom controls for Leaflet
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Update flyToFacility for Leaflet
  const flyToFacility = (facility: any) => {
    if (mapRef.current) {
      mapRef.current.setView([facility.latitude, facility.longitude], 14, {
        animate: true,
        duration: 1.5
      });
      setSelectedFacility(facility);
      setPopupInfo(facility);
    }
  };

  // Update handleResetLocation for Leaflet
  const handleResetLocation = () => {
    if (mapRef.current) {
      mapRef.current.setView([34.0522, -118.2437], 11, {
        animate: true,
        duration: 1.5
      });
      setPopupInfo(null);
    }
  };

  // Create a custom Leaflet control component
  const MapControls = () => {
    const map = useMap();
    
    useEffect(() => {
      // Store the map reference when component mounts
      if (map) {
        mapRef.current = map;
      }
    }, [map]);
    
    return null;
  };

  // Filter facilities based on active filters
  const filteredFacilities = facilities.filter(facility => {
    if (facility.type === 'hospital' && activeFilters.includes('hospitals')) return true;
    if (facility.type === 'emergency' && activeFilters.includes('emergencies')) return true;
    if (facility.type === 'clinic' && activeFilters.includes('clinics')) return true;
    return false;
  });

  // Handler for marker click
  const onMarkerClick = useCallback((e: React.MouseEvent<HTMLDivElement>, facility: any) => {
    e.stopPropagation();
    setPopupInfo(facility);
  }, []);

  // Update getFacilityColor - keeping the same logic
  const getFacilityColor = (facility: any) => {
    if (facility.status === 'inactive') {
      return theme.palette.grey[500];
    }
    if (facility.status === 'caution') {
      return theme.palette.warning.main;
    }
    
    // For active facilities
    if (facility.type === 'hospital') {
      return theme.palette.primary.main;
    } else if (facility.type === 'emergency') {
      return theme.palette.error.main;
    } else if (facility.type === 'clinic') {
      return theme.palette.success.main;
    }
    
    return theme.palette.primary.main;
  };

  // Create custom Leaflet icons for different facility types
  const createFacilityIcon = (facility: any) => {
    const color = getFacilityColor(facility);
    
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              ${getFacilityIconHTML(facility.type)}
            </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  // Helper to get facility icon HTML
  const getFacilityIconHTML = (type: string) => {
    let iconHTML = '';
    
    if (type === 'hospital') {
      iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>';
    } else if (type === 'emergency') {
      iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="white"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>';
    } else if (type === 'clinic') {
      iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="white"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h2v2h-2V4zm-2 6c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1zm2-3h3v9h-3V9z"/></svg>';
    }
    
    return iconHTML;
  };

  // Create custom Leaflet icon for ambulances
  const createAmbulanceIcon = (ambulance: any) => {
    const color = ambulance.status === 'inactive' 
      ? theme.palette.grey[500] 
      : (ambulance.inTransit ? theme.palette.warning.main : theme.palette.info.main);
    
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="white"><path d="M21 11h-1V7l-2-2h-7v.5h-2v-1c0-.83-.67-1.5-1.5-1.5S6 3.67 6 4.5v1c-1.66 0-3 1.34-3 3v5.39c0 .65.73 1.61.97 1.61h.5c.25 2.41 2.24 4 4.65 4 2.42 0 4.4-1.59 4.65-4h3.46c.25 2.41 2.24 4 4.65 4 2.42 0 4.4-1.59 4.65-4h.47c.3 0 .53-.39.53-.7V12c0-.55-.45-1-1-1zM9.13 18c-1.18 0-2.13-.95-2.13-2.13 0-1.18.95-2.13 2.13-2.13 1.18 0 2.13.95 2.13 2.13C11.26 17.05 10.31 18 9.13 18zm9.75 0c-1.18 0-2.13-.95-2.13-2.13 0-1.18.95-2.13 2.13-2.13 1.18 0 2.13.95 2.13 2.13 0 1.18-.95 2.13-2.13 2.13zM12 9h3.5L17 11h4v-.5h-3.5L16 9h-4v3H9.86c-.5-.57-1.23-.86-2-.86-.17 0-.34.03-.49.07V9H7v1H6V8h6v1z"></path></svg>
            </div>`,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5],
      popupAnchor: [0, -12.5]
    });
  };

  // Get facility icon based on type
  const getFacilityIcon = (type: string) => {
    switch(type) {
      case 'hospital': return <HospitalIcon />;
      case 'emergency': return <EmergencyIcon />;
      case 'clinic': return <ClinicIcon />;
      default: return <LocationIcon />;
    }
  };

  return (
    <Container maxWidth={false} sx={{ height: 'calc(100vh - 64px)', p: 0 }}>
      <Box sx={{ height: '100%', position: 'relative' }}>
        {isLoading ? (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" mt={2}>Loading Map...</Typography>
          </Box>
        ) : (
          <Grid container sx={{ height: '100%' }}>
            {/* Map container */}
            <Grid item xs={12} md={9} sx={{ height: '100%', position: 'relative' }}>
              {/* Map controls */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Paper elevation={3} sx={{ p: 1, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Tooltip title="Zoom In">
                      <IconButton onClick={handleZoomIn} size="small">
                        <ZoomInIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Zoom Out">
                      <IconButton onClick={handleZoomOut} size="small">
                        <ZoomOutIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset View">
                      <IconButton onClick={handleResetLocation} size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>

                <Paper elevation={3} sx={{ p: 1, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Tooltip title="Map Layers">
                      <IconButton size="small" onClick={(e) => setMapStyle(mapStyle === 'streets' ? 'satellite' : 'streets')}>
                        <LayersIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              </Box>
              
              {/* Leaflet Map */}
              <MapContainer 
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <MapControls />
                {/* Choose TileLayer based on selected style */}
                {mapStyle === 'streets' ? (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                ) : (
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                
                {/* Render facility markers based on filters */}
                {facilities.filter(f => 
                  (f.type === 'hospital' && activeFilters.includes('hospitals')) ||
                  (f.type === 'emergency' && activeFilters.includes('emergencies')) ||
                  (f.type === 'clinic' && activeFilters.includes('clinics'))
                ).map(facility => (
                  <Marker
                    key={facility.id}
                    position={[facility.latitude, facility.longitude]}
                    icon={createFacilityIcon(facility)}
                    eventHandlers={{
                      click: () => {
                        setPopupInfo(facility);
                        flyToFacility(facility);
                      }
                    }}
                  >
                    {popupInfo && popupInfo.id === facility.id && (
                      <Popup autoClose={false} closeOnClick={false}>
                        <Box sx={{ width: 200 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {facility.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                          </Typography>
                          <Box mt={1} mb={1}>
                            <LinearProgress 
                              variant="determinate" 
                              value={facility.capacity} 
                              color={facility.capacity > 80 ? "success" : facility.capacity > 50 ? "warning" : "error"}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption">
                              Capacity: {facility.capacity}%
                            </Typography>
                          </Box>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleFacilityClick(facility)}
                            endIcon={<ArrowForwardIcon />}
                            fullWidth
                          >
                            View Details
                          </Button>
                        </Box>
                      </Popup>
                    )}
                  </Marker>
                ))}
                
                {/* Render ambulance markers */}
                {activeFilters.includes('emergencies') && ambulances.map(ambulance => (
                  <Marker
                    key={ambulance.id}
                    position={[ambulance.latitude, ambulance.longitude]}
                    icon={createAmbulanceIcon(ambulance)}
                  >
                    <Popup>
                      <Box sx={{ width: 200 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {ambulance.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={ambulance.status === 'active' ? 'Active' : 'Inactive'} 
                          color={ambulance.status === 'active' ? 'success' : 'default'}
                          sx={{ mt: 1, mb: 1 }}
                        />
                        {ambulance.inTransit && ambulance.destination && (
                          <Typography variant="caption" display="block">
                            En route to: {ambulance.destination}
                          </Typography>
                        )}
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Grid>

            {/* Rest of the component remains unchanged for now */}
            <Grid item xs={12} md={3} sx={{ height: '100%', overflowY: 'auto', borderLeft: `1px solid ${theme.palette.divider}` }}>
              {/* Sidebar Header */}
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon color="primary" /> 
                  Medical Facilities
                </Typography>
                
                {/* Search box for facilities */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 0.5, 
                    pl: 1.5,
                    display: 'flex', 
                    alignItems: 'center', 
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: 30,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.background.paper, 1),
                      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.07)}`,
                    },
                    mb: 2,
                  }}
                >
                  <SearchIcon sx={{ color: alpha(theme.palette.text.secondary, 0.7), fontSize: 20 }} />
                  <TextField
                    placeholder="Filter facilities..."
                    variant="standard"
                    fullWidth
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{ ml: 1 }}
                  />
                </Paper>
                
                {/* Modern Filter Buttons */}
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                    Facility Type
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<HospitalIcon />}
                      label={`Hospitals (${facilities.filter(f => f.type === 'hospital').length})`}
                      clickable
                      color={activeFilters.includes('hospitals') ? 'primary' : 'default'}
                      onClick={() => handleFilterToggle('hospitals')}
                      sx={{ 
                        fontWeight: 500,
                        borderRadius: 2,
                        backgroundColor: activeFilters.includes('hospitals') 
                          ? undefined 
                          : alpha(theme.palette.primary.main, 0.05),
                        '& .MuiChip-icon': {
                          color: activeFilters.includes('hospitals') 
                            ? undefined 
                            : theme.palette.primary.main
                        }
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<EmergencyIcon />}
                      label={`Emergency (${facilities.filter(f => f.type === 'emergency').length})`}
                      clickable
                      color={activeFilters.includes('emergencies') ? 'error' : 'default'}
                      onClick={() => handleFilterToggle('emergencies')}
                      sx={{ 
                        fontWeight: 500,
                        borderRadius: 2,
                        backgroundColor: activeFilters.includes('emergencies') 
                          ? undefined 
                          : alpha(theme.palette.error.main, 0.05),
                        '& .MuiChip-icon': {
                          color: activeFilters.includes('emergencies') 
                            ? undefined 
                            : theme.palette.error.main
                        }
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<ClinicIcon />}
                      label={`Clinics (${facilities.filter(f => f.type === 'clinic').length})`}
                      clickable
                      color={activeFilters.includes('clinics') ? 'success' : 'default'}
                      onClick={() => handleFilterToggle('clinics')}
                      sx={{ 
                        fontWeight: 500,
                        borderRadius: 2,
                        backgroundColor: activeFilters.includes('clinics') 
                          ? undefined 
                          : alpha(theme.palette.success.main, 0.05),
                        '& .MuiChip-icon': {
                          color: activeFilters.includes('clinics') 
                            ? undefined 
                            : theme.palette.success.main
                        }
                      }}
                    />
                  </Stack>
                </Box>
                
                {/* Status filters */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                    Status
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ borderRadius: 1, mb: 1 }} 
                    />
                    <Chip 
                      label="Caution" 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                      sx={{ borderRadius: 1, mb: 1 }} 
                    />
                    <Chip 
                      label="Inactive" 
                      size="small" 
                      color="default" 
                      variant="outlined"
                      sx={{ borderRadius: 1, mb: 1 }} 
                    />
                  </Stack>
                </Box>
                
                <Divider sx={{ my: 2, opacity: 0.7 }} />
                
                {/* Distance slider - additional feature */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={600} 
                    color="text.secondary" 
                    sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>Distance Range</span>
                    <Chip size="small" label="10 km" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Stack spacing={2} direction="row" alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">1km</Typography>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={50} 
                          color="primary"
                          sx={{ 
                            height: 4, 
                            borderRadius: 2, 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': { borderRadius: 2 }
                          }} 
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">20km</Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>
              
              {/* Facilities List with modern design */}
              <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    {facilities.filter(f => 
                      (f.type === 'hospital' && activeFilters.includes('hospitals')) ||
                      (f.type === 'emergency' && activeFilters.includes('emergencies')) ||
                      (f.type === 'clinic' && activeFilters.includes('clinics'))
                    ).length} facilities found
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <NavigateNextIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Facility Cards */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {facilities.filter(f => 
                    (f.type === 'hospital' && activeFilters.includes('hospitals')) ||
                    (f.type === 'emergency' && activeFilters.includes('emergencies')) ||
                    (f.type === 'clinic' && activeFilters.includes('clinics'))
                  ).map(facility => (
                    <Card
                      key={facility.id}
                      elevation={0}
                      onClick={() => flyToFacility(facility)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2, 
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderLeft: `4px solid ${getFacilityColor(facility)}`,
                        backgroundColor: popupInfo && popupInfo.id === facility.id ? 
                          alpha(getFacilityColor(facility), 0.05) : alpha(theme.palette.background.paper, 0.6),
                        cursor: 'pointer',
                        boxShadow: popupInfo && popupInfo.id === facility.id ?
                          `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}` : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(getFacilityColor(facility), 0.08),
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        {/* Facility Icon with status indicator */}
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(getFacilityColor(facility), 0.1),
                              color: getFacilityColor(facility),
                              width: 40,
                              height: 40,
                            }}
                          >
                            {facility.type === 'hospital' && <HospitalIcon />}
                            {facility.type === 'emergency' && <EmergencyIcon />}
                            {facility.type === 'clinic' && <ClinicIcon />}
                          </Avatar>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: 
                                facility.status === 'active' ? theme.palette.success.main :
                                facility.status === 'caution' ? theme.palette.warning.main :
                                theme.palette.grey[500],
                              border: `2px solid ${theme.palette.background.paper}`,
                            }}
                          />
                        </Box>
                        
                        {/* Facility Info */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {facility.name}
                            </Typography>
                            <IconButton 
                              size="small" 
                              sx={{ p: 0.5, ml: 0.5 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(facility.id);
                              }}
                            >
                              {favorites.includes(facility.id) ? 
                                <StarIcon fontSize="small" color="warning" /> : 
                                <StarBorderIcon fontSize="small" color="action" />
                              }
                            </IconButton>
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)} • {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                          </Typography>
                          
                          {/* Capacity bar */}
                          <Box sx={{ mt: 1, mb: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="caption" fontWeight={500}>
                                Capacity
                              </Typography>
                              <Typography variant="caption" fontWeight={600} 
                                color={
                                  facility.capacity > 80 ? "success.main" : 
                                  facility.capacity > 50 ? "warning.main" : 
                                  "error.main"
                                }
                              >
                                {facility.capacity}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={facility.capacity} 
                              color={facility.capacity > 80 ? "success" : facility.capacity > 50 ? "warning" : "error"}
                              sx={{ 
                                height: 4, 
                                borderRadius: 2,
                                bgcolor: alpha(
                                  facility.capacity > 80 ? theme.palette.success.main : 
                                  facility.capacity > 50 ? theme.palette.warning.main : 
                                  theme.palette.error.main,
                                  0.1
                                )
                              }}
                            />
                          </Box>
                          
                          {/* Location info - could be dynamic with real data */}
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            mt: 1
                          }}>
                            <LocationIcon sx={{ fontSize: 14 }} />
                            {Math.floor(Math.random() * 10) + 1} km away
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
                
                {/* No results message */}
                {facilities.filter(f => 
                  (f.type === 'hospital' && activeFilters.includes('hospitals')) ||
                  (f.type === 'emergency' && activeFilters.includes('emergencies')) ||
                  (f.type === 'clinic' && activeFilters.includes('clinics'))
                ).length === 0 && (
                  <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <LocationIcon color="disabled" sx={{ fontSize: 48, opacity: 0.4 }} />
                    <Typography color="text.secondary" align="center">
                      No medical facilities match your current filters.
                      <br />
                      Try selecting different facility types.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => setActiveFilters(['hospitals', 'emergencies', 'clinics'])}
                      startIcon={<RefreshIcon />}
                    >
                      Reset Filters
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Facility Detail Dialog */}
      {selectedFacility && (
        <Dialog
          open={facilityDialogOpen}
          onClose={() => setFacilityDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
            }
          }}
          TransitionComponent={Fade}
        >
          {/* Modern Dialog Header */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ 
              height: 200, 
              width: '100%', 
              position: 'relative',
              overflow: 'hidden',
            }}>
              {facilityDetails[selectedFacility.name] && (
                <Box
                  component="img"
                  src={facilityDetails[selectedFacility.name].image}
                  alt={selectedFacility.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.7)',
                  }}
                />
              )}
              
              {/* Gradient overlay */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)`,
                zIndex: 1,
              }} />
              
              {/* Close button */}
              <IconButton 
                onClick={() => setFacilityDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white',
                  backgroundColor: alpha('#000', 0.2),
                  '&:hover': { backgroundColor: alpha('#000', 0.4) },
                  zIndex: 2,
                }}
              >
                <CloseIcon />
              </IconButton>
              
              {/* Header content */}
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                zIndex: 2,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <Chip 
                    label={selectedFacility.type.charAt(0).toUpperCase() + selectedFacility.type.slice(1)} 
                    size="small" 
                    color={
                      selectedFacility.type === 'hospital' ? 'primary' :
                      selectedFacility.type === 'emergency' ? 'error' : 'success'
                    }
                  />
                  <Chip 
                    label={selectedFacility.status.charAt(0).toUpperCase() + selectedFacility.status.slice(1)} 
                    size="small" 
                    color={
                      selectedFacility.status === 'active' ? 'success' :
                      selectedFacility.status === 'caution' ? 'warning' : 'default'
                    }
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: favorites.includes(selectedFacility.id) ? theme.palette.warning.main : 'white',
                      '&:hover': { backgroundColor: alpha('#fff', 0.1) },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedFacility.id);
                    }}
                  >
                    {favorites.includes(selectedFacility.id) ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </Box>
                
                <Typography variant="h4" fontWeight="700" color="white">
                  {selectedFacility.name}
                </Typography>
                
                {facilityDetails[selectedFacility.name] && (
                  <Typography variant="body2" color="white" sx={{ opacity: 0.85, maxWidth: '80%' }}>
                    {facilityDetails[selectedFacility.name].address}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <DialogContent sx={{ p: 0 }}>
            {facilityDetails[selectedFacility.name] ? (
              <Box>
                {/* Quick info cards */}
                <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Card sx={{ 
                    flexGrow: 1, 
                    minWidth: { xs: '100%', sm: 180 }, 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        AVAILABLE BEDS
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="h4" fontWeight="700" color="primary.main">
                          {facilityDetails[selectedFacility.name].beds.available}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          / {facilityDetails[selectedFacility.name].beds.total}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    flexGrow: 1, 
                    minWidth: { xs: '100%', sm: 180 }, 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.08)}`
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        WAIT TIME
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="h4" fontWeight="700" color="warning.main">
                          {facilityDetails[selectedFacility.name].emergencyWait !== 'N/A' ? 
                            facilityDetails[selectedFacility.name].emergencyWait : '—'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ 
                    flexGrow: 1, 
                    minWidth: { xs: '100%', sm: 180 }, 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.08)}`
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        RATING
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="h4" fontWeight="700" color="success.main">
                          {facilityDetails[selectedFacility.name].rating}
                        </Typography>
                        <Rating 
                          value={facilityDetails[selectedFacility.name].rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                
                {/* Facility content tabs */}
                <Box sx={{ px: 3, pb: 3 }}>
                  <Tabs 
                    value={0} 
                    sx={{
                      mb: 3,
                      '& .MuiTab-root': {
                        minWidth: 120, 
                        textTransform: 'none',
                        fontWeight: 600
                      }
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Services" />
                    <Tab label="Departments" />
                  </Tabs>
                  
                  {/* Main content in grid layout */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        About
                      </Typography>
                      <Typography paragraph>
                        {facilityDetails[selectedFacility.name].description}
                      </Typography>
                      
                      <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                              <LocationIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>Address</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {facilityDetails[selectedFacility.name].address}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                              <PhoneIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>Phone</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {facilityDetails[selectedFacility.name].phone}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                              <ScheduleIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>Hours</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {facilityDetails[selectedFacility.name].hours}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Button 
                            startIcon={<MyLocationIcon />}
                            sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 2 }}
                            variant="outlined"
                            onClick={() => {
                              setFacilityDialogOpen(false);
                              flyToFacility(selectedFacility);
                            }}
                          >
                            View on Map
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Services
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                        {facilityDetails[selectedFacility.name].services.map((service: string) => (
                          <Chip 
                            key={service} 
                            label={service} 
                            sx={{ 
                              borderRadius: 1.5,
                              boxShadow: `0 2px 8px ${alpha(theme.palette.divider, 0.5)}`,
                            }} 
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Departments
                      </Typography>
                      <Grid container spacing={1.5} sx={{ mb: 3 }}>
                        {facilityDetails[selectedFacility.name].departments.map((dept: string) => (
                          <Grid item xs={6} key={dept}>
                            <Paper 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: 2, 
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: theme.palette.primary.main 
                                }} 
                              />
                              <Typography variant="body2">{dept}</Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      
                      {/* Additional feature: Capacity chart */}
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Current Status
                      </Typography>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)},`,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          mb: 2
                        }}
                      >
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight={600}>Capacity</Typography>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600}
                            color={
                              selectedFacility.capacity > 80 ? theme.palette.success.main :
                              selectedFacility.capacity > 50 ? theme.palette.warning.main :
                              theme.palette.error.main
                            }
                          >
                            {selectedFacility.capacity}%
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedFacility.capacity} 
                            color={selectedFacility.capacity > 80 ? "success" : selectedFacility.capacity > 50 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          This facility is currently operating at {selectedFacility.capacity}% capacity.
                          {selectedFacility.capacity > 80 ? " Good availability." 
                           : selectedFacility.capacity > 50 ? " Limited availability." 
                           : " Critical capacity - expect delays."}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>No detailed information available for this facility.</Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <Button 
              variant="outlined" 
              onClick={() => setFacilityDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<InfoIcon />}
              onClick={() => {
                setFacilityDialogOpen(false);
              }}
              sx={{ 
                borderRadius: 2,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
              }}
            >
              Full Details
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default MapView; 