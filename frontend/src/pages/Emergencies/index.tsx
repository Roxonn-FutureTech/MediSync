import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Stack,
  LinearProgress,
  Container,
  Paper,
  Chip,
  Tabs,
  Tab,
  Fab,
  Zoom,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Warning as WarningIcon,
  DirectionsRun as DirectionsRunIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  LocalHospital,
  Phone,
  Speed,
  Assignment as AssignmentIcon,
  List as ListIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatusBadge from '../../components/common/StatusBadge';
import StatCard from '../../components/common/StatCard';
import EmergencyProtocols from './components/EmergencyProtocols';

interface Emergency {
  id: number;
  type: string;
  location: string;
  status: 'critical' | 'stable' | 'moderate' | 'pending';
  patient: {
    name: string;
    age: number;
    condition: string;
  };
  assignedTo: {
    team: string;
    contact: string;
  };
  hospital: {
    name: string;
    distance: string;
    eta: string;
  };
  responseTime: string;
  priority: number;
}

const mockEmergencies: Emergency[] = [
  {
    id: 1,
    type: 'Cardiac Arrest',
    location: '123 Emergency St',
    status: 'critical',
    patient: {
      name: 'John Doe',
      age: 65,
      condition: 'Critical',
    },
    assignedTo: {
      team: 'Rapid Response Team A',
      contact: '+1 (555) 123-4567',
    },
    hospital: {
      name: 'Central Medical Center',
      distance: '2.5 km',
      eta: '8 mins',
    },
    responseTime: '2 mins ago',
    priority: 1,
  },
  // Add more mock emergencies
];

// Create TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`emergency-tabpanel-${index}`}
      aria-labelledby={`emergency-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `emergency-tab-${index}`,
    'aria-controls': `emergency-tabpanel-${index}`,
  };
};

const Emergencies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Function to quickly navigate to protocols tab
  const goToProtocols = () => {
    setTabValue(1);
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      {/* Quick access floating action button - only visible when not on protocols tab */}
      <Zoom in={tabValue !== 1}>
        <Fab
          color="error"
          aria-label="emergency protocols"
          onClick={goToProtocols}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.25)',
          }}
        >
          <AssignmentIcon />
        </Fab>
      </Zoom>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sx={{ pl: { xs: 5, md: 3 }, pt: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Emergencies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Monitor and manage emergency situations
          </Typography>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Active Emergencies Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(185, 28, 28, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <WarningIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} />
                <Chip label="-20%" color="error" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  12
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                  Active Emergencies
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Available Teams Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <DirectionsRunIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} />
                <Chip label="+5%" color="success" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  8
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                  Available Teams
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Response Time Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} />
                <Chip label="+12%" color="warning" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  4.5 <Typography component="span" variant="h5" sx={{ fontWeight: 500 }}>min</Typography>
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                  Avg. Response Time
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Success Rate Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.85)' }} />
                <Chip label="+3%" color="info" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  94<Typography component="span" variant="h4" sx={{ fontWeight: 500 }}>%</Typography>
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                  Success Rate
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : undefined}
                allowScrollButtonsMobile
                sx={{ 
                  px: 2, 
                  '& .MuiTab-root': { 
                    minHeight: 64,
                    fontWeight: 600,
                    fontSize: isMobile ? '0.75rem' : 'inherit',
                  }
                }}
              >
                <Tab 
                  icon={<ListIcon />} 
                  iconPosition="start" 
                  label="Emergency List" 
                  {...a11yProps(0)} 
                />
                <Tab 
                  icon={<AssignmentIcon />} 
                  iconPosition="start" 
                  label={isMobile ? "Protocols" : "Response Protocols"} 
                  {...a11yProps(1)} 
                />
                <Tab 
                  icon={<LocationOnIcon />} 
                  iconPosition="start" 
                  label="Map View" 
                  {...a11yProps(2)} 
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search emergencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Emergency Details</TableCell>
                        <TableCell>Patient Info</TableCell>
                        <TableCell>Assigned Team</TableCell>
                        <TableCell>Hospital</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockEmergencies.map((emergency) => (
                        <TableRow
                          key={emergency.id}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                        >
                          <TableCell>
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" color="primary">
                                {emergency.type}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <LocalHospital sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{emergency.location}</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Reported {emergency.responseTime}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="body2">{emergency.patient.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Age: {emergency.patient.age}
                              </Typography>
                              <Typography variant="body2" color="error">
                                {emergency.patient.condition}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="body2">{emergency.assignedTo.team}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{emergency.assignedTo.contact}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalHospital sx={{ fontSize: 16, mr: 0.5, color: theme.palette.primary.main }} />
                                <Typography variant="body2">{emergency.hospital.name}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Distance: {emergency.hospital.distance}
                              </Typography>
                              <Typography variant="body2" color="warning.main">
                                ETA: {emergency.hospital.eta}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={emergency.status} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: 100 }}>
                              <LinearProgress
                                variant="determinate"
                                value={((4 - emergency.priority) / 3) * 100}
                                color={
                                  emergency.priority === 1
                                    ? 'error'
                                    : emergency.priority === 2
                                    ? 'warning'
                                    : 'success'
                                }
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <EmergencyProtocols />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2, height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Emergency Map View - Integrated with main map component
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Emergencies; 