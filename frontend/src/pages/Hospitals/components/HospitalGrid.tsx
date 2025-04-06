import { FC } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip, 
  LinearProgress,
  Stack,
  CardActionArea,
  Badge,
  alpha,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as ClockIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { Hospital } from '../HospitalDashboard';

interface HospitalGridProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
}

const HospitalGrid: FC<HospitalGridProps> = ({ hospitals, onViewDetails }) => {
  const theme = useTheme();
  
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
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Available';
      case 'limited':
        return 'Limited';
      case 'full':
        return 'Full';
      default:
        return status;
    }
  };
  
  return (
    <Grid container spacing={3}>
      {hospitals.map((hospital) => (
        <Grid item xs={12} sm={6} md={4} key={hospital.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="160"
                image={hospital.image}
                alt={hospital.name}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  borderRadius: '16px',
                  px: 1.5,
                  py: 0.5,
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 1
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <HospitalIcon fontSize="small" /> {hospital.type}
                </Typography>
              </Box>
              
              <Chip
                label={getStatusText(hospital.status)}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  bgcolor: alpha(getStatusColor(hospital.status), 0.9),
                  color: '#fff',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)',
                  boxShadow: 1
                }}
                size="small"
              />
            </Box>
            
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" component="h2" noWrap fontWeight="bold">
                  {hospital.name}
                </Typography>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(hospital);
                    }}
                    sx={{ 
                      ml: 1, 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5
                  }}
                >
                  <LocationIcon fontSize="small" sx={{ mt: 0.25 }} />
                  <span>{hospital.address}</span>
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <PhoneIcon fontSize="small" />
                  {hospital.phone}
                </Typography>
              </Stack>
              
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Bed Capacity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={hospital.stats.occupancyRate} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: hospital.stats.occupancyRate > 90 
                            ? theme.palette.error.main 
                            : hospital.stats.occupancyRate > 70 
                              ? theme.palette.warning.main 
                              : theme.palette.success.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {hospital.stats.occupancyRate}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {hospital.stats.availableBeds} beds available
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <ClockIcon fontSize="inherit" />
                    Updated {hospital.lastUpdated}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            
            <CardActionArea onClick={() => onViewDetails(hospital)}>
              <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Typography 
                  variant="body2" 
                  color="primary"
                  fontWeight="medium"
                >
                  View Details
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  {hospital.distance} miles away
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default HospitalGrid; 