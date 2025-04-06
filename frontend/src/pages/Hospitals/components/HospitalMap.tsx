import { FC, useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Slider,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as MyLocationIcon,
  LayersOutlined as LayersIcon,
  LocalHospital as HospitalIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Hospital } from '../HospitalDashboard';

interface HospitalMapProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
}

const HospitalMap: FC<HospitalMapProps> = ({ hospitals, onViewDetails }) => {
  const theme = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [zoom, setZoom] = useState(12);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'limited':
        return theme.palette.warning.main;
      case 'full':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon fontSize="small" />;
      case 'limited':
        return <WarningIcon fontSize="small" />;
      case 'full':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };
  
  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };
  
  const handleViewDetails = () => {
    if (selectedHospital) {
      onViewDetails(selectedHospital);
    }
  };
  
  return (
    <Box sx={{ position: 'relative', height: '70vh', borderRadius: 2, overflow: 'hidden' }}>
      {/* Map container */}
      <Box 
        ref={mapContainerRef}
        sx={{ 
          height: '100%', 
          width: '100%', 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          backgroundImage: 'url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/600x600?access_token=placeholder)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!mapLoaded ? (
          <CircularProgress />
        ) : (
          <>
            {/* Hospital markers */}
            {hospitals.map((hospital) => (
              <Box 
                key={hospital.id}
                onClick={() => handleHospitalClick(hospital)}
                sx={{
                  position: 'absolute',
                  // Random positions for demo purposes
                  left: `${30 + (hospital.id.charCodeAt(hospital.id.length - 1) % 40)}%`,
                  top: `${20 + (hospital.id.charCodeAt(0) % 60)}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: selectedHospital?.id === hospital.id ? 10 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  }
                }}
              >
                <Tooltip 
                  title={hospital.name}
                  arrow
                  placement="top"
                >
                  <Box sx={{ position: 'relative' }}>
                    <HospitalIcon 
                      sx={{ 
                        fontSize: selectedHospital?.id === hospital.id ? 40 : 32, 
                        color: getStatusColor(hospital.status),
                        filter: `drop-shadow(0px 3px 3px ${alpha('#000', 0.3)})`,
                      }} 
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        bgcolor: getStatusColor(hospital.status),
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>
            ))}
            
            {/* Selected hospital info */}
            {selectedHospital && (
              <Card 
                elevation={3}
                sx={{ 
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  width: 320,
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      height: 100,
                      backgroundImage: `url(${selectedHospital.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    <Box 
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 2
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" color="white">
                        {selectedHospital.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="white"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          opacity: 0.9
                        }}
                      >
                        <LocationIcon fontSize="inherit" />
                        {selectedHospital.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      icon={getStatusIcon(selectedHospital.status)}
                      label={selectedHospital.status.charAt(0).toUpperCase() + selectedHospital.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(selectedHospital.status), 0.1),
                        color: getStatusColor(selectedHospital.status),
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: getStatusColor(selectedHospital.status)
                        }
                      }}
                    />
                    <Chip
                      label={`${selectedHospital.distance} miles`}
                      size="small"
                      icon={<LocationIcon fontSize="small" />}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedHospital.type} • {selectedHospital.stats.availableBeds} beds available
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleViewDetails}
                    sx={{ mt: 1 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
      
      {/* Map controls */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 1, 
            borderRadius: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1 
          }}
        >
          <Tooltip title="Zoom in">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Box 
            sx={{ 
              height: 100, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <Slider
              orientation="vertical"
              value={zoom}
              min={8}
              max={18}
              step={1}
              onChange={(e, newValue) => setZoom(newValue as number)}
              sx={{ height: '100%' }}
            />
          </Box>
          
          <Tooltip title="Zoom out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
      
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 1, 
            borderRadius: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1 
          }}
        >
          <Tooltip title="My Location">
            <IconButton size="small">
              <MyLocationIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Map Layers">
            <IconButton size="small">
              <LayersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
      
      <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 1.5,
            borderRadius: 2
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Map data © 2023
          </Typography>
        </Paper>
      </Box>
      
      {/* Legend */}
      <Box sx={{ position: 'absolute', bottom: 16, left: selectedHospital ? 352 : 16 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 1.5,
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Hospital Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: theme.palette.success.main
                }}
              />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: theme.palette.warning.main
                }}
              />
              <Typography variant="caption">Limited</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: theme.palette.error.main
                }}
              />
              <Typography variant="caption">Full</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HospitalMap; 