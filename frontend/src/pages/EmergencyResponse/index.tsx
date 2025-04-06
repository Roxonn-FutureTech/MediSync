import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Stack,
  Chip,
  Button,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  DirectionsRun as ResponderIcon,
  Notifications as AlertIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DirectionsCar as AmbulanceIcon,
  MyLocation as TrackIcon,
  Navigation as NavigationIcon,
  People as TeamIcon,
  LocalShipping as ResourceIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data interfaces
interface EmergencyCase {
  id: string;
  type: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'en-route' | 'on-scene' | 'completed';
  responseTime: number;
  assignedTeam: {
    id: string;
    name: string;
    eta: number;
    members: number;
  };
  resources: {
    ambulances: number;
    medicalKits: number;
    specialEquipment: string[];
  };
}

interface ResourceStatus {
  type: string;
  available: number;
  total: number;
  icon: React.ReactNode;
}

// Mock data
const mockEmergencies: EmergencyCase[] = [
  {
    id: 'EM001',
    type: 'Cardiac Emergency',
    location: {
      address: '123 Main St, Downtown',
      coordinates: [40.7128, -74.0060],
    },
    priority: 'high',
    status: 'active',
    responseTime: 3,
    assignedTeam: {
      id: 'T1',
      name: 'Rapid Response Team 1',
      eta: 5,
      members: 4,
    },
    resources: {
      ambulances: 2,
      medicalKits: 3,
      specialEquipment: ['Defibrillator', 'Oxygen Tank'],
    },
  },
  // Add more mock emergencies...
];

const mockResources: ResourceStatus[] = [
  {
    type: 'Ambulances',
    available: 8,
    total: 12,
    icon: <AmbulanceIcon />,
  },
  {
    type: 'Response Teams',
    available: 5,
    total: 8,
    icon: <TeamIcon />,
  },
  {
    type: 'Medical Kits',
    available: 15,
    total: 20,
    icon: <ResourceIcon />,
  },
];

const EmergencyResponse = () => {
  const theme = useTheme();
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyCase | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergencySelect = (emergency: EmergencyCase) => {
    setSelectedEmergency(emergency);
    setMapCenter(emergency.location.coordinates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.error.main;
      case 'en-route':
        return theme.palette.warning.main;
      case 'on-scene':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return null;
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Emergency Response Center
        </Typography>
        <Stack direction="row" spacing={2}>
          <Badge badgeContent={3} color="error">
            <IconButton color="primary">
              <AlertIcon />
            </IconButton>
          </Badge>
          <Button
            variant="contained"
            startIcon={<ResponderIcon />}
            color="error"
          >
            New Emergency
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Resource Status Cards */}
        {mockResources.map((resource) => (
          <Grid item xs={12} md={4} key={resource.type}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  {resource.icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {resource.type}
                  </Typography>
                  <Typography variant="h6">
                    {resource.available} / {resource.total}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(resource.available / resource.total) * 100}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}

        {/* Map View */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: 500,
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {mockEmergencies.map((emergency) => (
                <Marker
                  key={emergency.id}
                  position={emergency.location.coordinates}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${getStatusColor(emergency.status)}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                  })}
                >
                  <Popup>
                    <Typography variant="subtitle2">{emergency.type}</Typography>
                    <Typography variant="body2">{emergency.location.address}</Typography>
                    <Typography variant="caption">ETA: {emergency.assignedTeam.eta} mins</Typography>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        </Grid>

        {/* Active Emergencies List */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 500,
              overflow: 'auto',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Active Emergencies
              </Typography>
              <List>
                <AnimatePresence>
                  {mockEmergencies.map((emergency) => (
                    <motion.div
                      key={emergency.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ListItem
                        button
                        onClick={() => handleEmergencySelect(emergency)}
                        selected={selectedEmergency?.id === emergency.id}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                      >
                        <ListItemIcon>
                          {getPriorityIcon(emergency.priority)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="subtitle2">
                                {emergency.type}
                              </Typography>
                              <Chip
                                size="small"
                                label={emergency.status}
                                sx={{
                                  bgcolor: alpha(getStatusColor(emergency.status), 0.1),
                                  color: getStatusColor(emergency.status),
                                }}
                              />
                            </Stack>
                          }
                          secondary={
                            <Stack spacing={1} mt={1}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <LocationIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  {emergency.location.address}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <TimerIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  ETA: {emergency.assignedTeam.eta} mins
                                </Typography>
                              </Stack>
                            </Stack>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </Box>
          </Card>
        </Grid>

        {/* Selected Emergency Details */}
        {selectedEmergency && (
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Emergency Details</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Chip
                        icon={getPriorityIcon(selectedEmergency.priority)}
                        label={`Priority: ${selectedEmergency.priority}`}
                        color={selectedEmergency.priority === 'high' ? 'error' : 'default'}
                      />
                      <Chip
                        icon={<TimerIcon />}
                        label={`Response Time: ${selectedEmergency.responseTime} mins`}
                      />
                    </Stack>
                    <Typography variant="body2">
                      Location: {selectedEmergency.location.address}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Assigned Resources</Typography>
                    <Stack direction="row" spacing={2}>
                      <Chip
                        icon={<AmbulanceIcon />}
                        label={`Ambulances: ${selectedEmergency.resources.ambulances}`}
                      />
                      <Chip
                        icon={<TeamIcon />}
                        label={`Team Members: ${selectedEmergency.assignedTeam.members}`}
                      />
                    </Stack>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Special Equipment:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {selectedEmergency.resources.specialEquipment.map((equipment) => (
                          <Chip key={equipment} size="small" label={equipment} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EmergencyResponse; 