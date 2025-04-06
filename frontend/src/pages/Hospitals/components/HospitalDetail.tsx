import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Avatar,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  DirectionsCar as DirectionsIcon,
  Link as LinkIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Room as RoomIcon
} from '@mui/icons-material';
import { Hospital } from '../HospitalDashboard';
import { useState } from 'react';

interface HospitalDetailProps {
  hospital: Hospital | null;
  open: boolean;
  onClose: () => void;
}

const HospitalDetail: FC<HospitalDetailProps> = ({ hospital, open, onClose }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  if (!hospital) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success;
      case 'limited':
        return theme.palette.warning;
      case 'full':
        return theme.palette.error;
      default:
        return theme.palette.grey;
    }
  };

  const statusColor = getStatusColor(hospital.status);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            height: 200,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            backgroundImage: `url(${hospital.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {hospital.name}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="white"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                    opacity: 0.9
                  }}
                >
                  <LocationIcon fontSize="small" />
                  {hospital.address}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(hospital.status)}
                label={hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                sx={{
                  bgcolor: alpha(statusColor.main, 0.9),
                  color: 'white',
                  fontWeight: 'bold',
                  px: 1,
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
        
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(4px)',
            '&:hover': {
              bgcolor: alpha(theme.palette.background.paper, 0.9),
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<InfoIcon />} label="Overview" iconPosition="start" />
          <Tab icon={<MedicalIcon />} label="Services" iconPosition="start" />
          <Tab icon={<RoomIcon />} label="Capacity" iconPosition="start" />
        </Tabs>
      </Box>
      
      <Divider />
      
      <DialogContent>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HospitalIcon color="primary" /> About
                </Typography>
                <Typography variant="body2" paragraph>
                  {hospital.description || 'A leading healthcare facility providing exceptional medical services to the community. Specializing in various healthcare domains with state-of-the-art equipment and experienced professionals.'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mt: 2 
                }}>
                  <Chip 
                    label={hospital.type} 
                    size="small" 
                    icon={<HospitalIcon fontSize="small" />}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${hospital.distance} miles away`} 
                    size="small" 
                    icon={<LocationIcon fontSize="small" />}
                    variant="outlined"
                  />
                  {hospital.stats.emergencyCapacity && (
                    <Chip 
                      label="Emergency Services" 
                      size="small" 
                      icon={<MedicalIcon fontSize="small" />}
                      variant="outlined"
                      color="error"
                    />
                  )}
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" /> Hospital Details
                </Typography>
                
                <List disablePadding>
                  <ListItem disablePadding sx={{ pb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone Number" 
                      secondary={hospital.phone}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ pb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Address" 
                      secondary={hospital.email || 'contact@' + hospital.name.toLowerCase().replace(/\s/g, '') + '.com'}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ pb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LinkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Website" 
                      secondary={hospital.website || 'www.' + hospital.name.toLowerCase().replace(/\s/g, '') + '.com'}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ pb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Operating Hours" 
                      secondary={hospital.operatingHours || '24/7 - Emergency Services Available'}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Staff Count" 
                      secondary={hospital.staffCount || 'Over 500 healthcare professionals'}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RoomIcon color="primary" /> Capacity Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">Current Occupancy</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {hospital.stats.occupancyRate}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={hospital.stats.occupancyRate} 
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: hospital.stats.occupancyRate > 90 
                          ? theme.palette.error.main 
                          : hospital.stats.occupancyRate > 70 
                            ? theme.palette.warning.main 
                            : theme.palette.success.main,
                        borderRadius: 5
                      }
                    }}
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Paper 
                      sx={{ 
                        p: 1.5, 
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.1)
                      }}
                    >
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {hospital.stats.availableBeds}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Available Beds
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper 
                      sx={{ 
                        p: 1.5, 
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    >
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {hospital.stats.totalBeds || hospital.stats.availableBeds + Math.floor(hospital.stats.availableBeds * hospital.stats.occupancyRate / (100 - hospital.stats.occupancyRate))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Beds
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {hospital.stats.emergencyCapacity && (
                  <Box sx={{ mt: 2, p: 1.5, border: 1, borderColor: 'error.main', borderRadius: 1, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                    <Typography variant="subtitle2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MedicalIcon fontSize="small" /> Emergency Capacity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hospital.stats.emergencyCapacity}% available for emergency admissions
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <TimeIcon fontSize="inherit" /> Last updated: {hospital.lastUpdated || 'Today, 2:30 PM'}
                  </Typography>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star as StarIcon color="primary" /> Ratings & Reviews
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  p: 2
                }}>
                  <Typography variant="h2" fontWeight="bold" color="primary.main">
                    {hospital.rating || '4.8'}
                  </Typography>
                  <Box sx={{ display: 'flex', my: 1 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarIcon 
                        key={star} 
                        sx={{ 
                          color: star <= Math.floor(hospital.rating || 4.8) 
                            ? 'warning.main' 
                            : star - Math.floor(hospital.rating || 4.8) <= 0.5
                              ? 'warning.main'
                              : 'grey.300',
                          fontSize: 20
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Based on {hospital.reviewCount || '380'} reviews
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalIcon color="primary" /> Available Services
            </Typography>
            
            <Grid container spacing={2}>
              {(hospital.services || [
                'Emergency Care', 'General Medicine', 'Cardiology', 
                'Orthopedics', 'Neurology', 'Pediatrics', 
                'Obstetrics & Gynecology', 'Radiology'
              ]).map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }}
                    >
                      <MedicalIcon />
                    </Avatar>
                    <Typography variant="subtitle2">
                      {service}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoomIcon color="primary" /> Bed Capacity Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">General Ward</Typography>
                      <Typography variant="subtitle2">
                        {Math.floor(hospital.stats.availableBeds * 0.6)}/{Math.floor((hospital.stats.totalBeds || hospital.stats.availableBeds + Math.floor(hospital.stats.availableBeds * hospital.stats.occupancyRate / (100 - hospital.stats.occupancyRate))) * 0.6)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={70} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.success.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Private Rooms</Typography>
                      <Typography variant="subtitle2">
                        {Math.floor(hospital.stats.availableBeds * 0.2)}/{Math.floor((hospital.stats.totalBeds || hospital.stats.availableBeds + Math.floor(hospital.stats.availableBeds * hospital.stats.occupancyRate / (100 - hospital.stats.occupancyRate))) * 0.2)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={50} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.success.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">ICU</Typography>
                      <Typography variant="subtitle2">
                        {Math.floor(hospital.stats.availableBeds * 0.1)}/{Math.floor((hospital.stats.totalBeds || hospital.stats.availableBeds + Math.floor(hospital.stats.availableBeds * hospital.stats.occupancyRate / (100 - hospital.stats.occupancyRate))) * 0.1)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.warning.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Emergency</Typography>
                      <Typography variant="subtitle2">
                        {Math.floor(hospital.stats.availableBeds * 0.1)}/{Math.floor((hospital.stats.totalBeds || hospital.stats.availableBeds + Math.floor(hospital.stats.availableBeds * hospital.stats.occupancyRate / (100 - hospital.stats.occupancyRate))) * 0.1)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={95} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.error.main,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Daily Statistics
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Admissions
                        </Typography>
                        <Typography variant="h5" fontWeight="medium">
                          {Math.floor((hospital.stats.totalBeds || 100) * 0.15)} patients/day
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Length of Stay
                        </Typography>
                        <Typography variant="h5" fontWeight="medium">
                          3.8 days
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Turnover Rate
                        </Typography>
                        <Typography variant="h5" fontWeight="medium">
                          24% weekly
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </DialogContent>
      
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          startIcon={<DirectionsIcon />}
          variant="outlined"
        >
          Get Directions
        </Button>
        
        <Button 
          startIcon={<PhoneIcon />}
          variant="contained"
          color="primary"
        >
          Contact Hospital
        </Button>
      </Box>
    </Dialog>
  );
};

export default HospitalDetail; 