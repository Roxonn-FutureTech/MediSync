import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
  LinearProgress,
  Stack,
  Divider,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Skeleton,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  alpha,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  DirectionsCar as AmbulanceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  DarkMode as DarkModeIcon,
  GridView as Grid4x4Icon,
  TableChart as TableChartIcon,
  Email as EmailIcon,
  MedicalServices as MedicalIcon,
  People as PeopleIcon,
  Bed as BedIcon,
  Warning as EmergencyIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import StatusBadge from '../../components/common/StatusBadge';

interface HospitalStats {
  totalPatients: number;
  avgWaitTime: number;
  emergencyResponses: number;
  occupancyTrend: number[];
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  totalBeds: number;
  availableBeds: number;
  occupancyRate: number;
  emergencyCapacity: boolean;
  specialties: string[];
  staffCount: number;
  status: 'active' | 'full' | 'limited';
  lastUpdated: string;
  coordinates: [number, number];
  stats: HospitalStats;
  departments: {
    name: string;
    beds: {
      total: number;
      available: number;
    };
    status: 'critical' | 'stable' | 'moderate';
  }[];
}

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Central Medical Center',
    location: '123 Healthcare Ave, Medical District',
    phone: '+1 (555) 123-4567',
    email: 'info@centralmed.com',
    totalBeds: 500,
    availableBeds: 125,
    occupancyRate: 75,
    emergencyCapacity: true,
    specialties: ['Emergency Care', 'Trauma', 'ICU', 'Surgery'],
    staffCount: 350,
    status: 'active',
    lastUpdated: '5 minutes ago',
    coordinates: [40.7128, -74.0060],
    stats: {
      totalPatients: 375,
      avgWaitTime: 15,
      emergencyResponses: 45,
      occupancyTrend: [65, 70, 72, 75, 73, 75]
    },
    departments: [
      {
        name: 'Emergency',
        beds: { total: 50, available: 10 },
        status: 'critical',
      },
      {
        name: 'ICU',
        beds: { total: 30, available: 5 },
        status: 'critical',
      },
      {
        name: 'General',
        beds: { total: 100, available: 45 },
        status: 'stable',
      },
    ],
  },
  {
    id: '2',
    name: 'Metropolitan Hospital',
    location: '456 Medical Park, Downtown',
    phone: '+1 (555) 987-6543',
    email: 'contact@metrohospital.com',
    totalBeds: 300,
    availableBeds: 45,
    occupancyRate: 85,
    emergencyCapacity: true,
    specialties: ['Emergency Care', 'Cardiology', 'Neurology'],
    staffCount: 250,
    status: 'limited',
    lastUpdated: '10 minutes ago',
    coordinates: [40.7589, -73.9851],
    stats: {
      totalPatients: 255,
      avgWaitTime: 25,
      emergencyResponses: 30,
      occupancyTrend: [75, 78, 80, 82, 85, 85]
    },
    departments: [
      {
        name: 'Emergency',
        beds: { total: 50, available: 10 },
        status: 'critical',
      },
      {
        name: 'Cardiology',
        beds: { total: 30, available: 5 },
        status: 'critical',
      },
      {
        name: 'Neurology',
        beds: { total: 100, available: 45 },
        status: 'stable',
      },
    ],
  },
  {
    id: '3',
    name: 'Community Health Center',
    location: '789 Wellness Road, Suburbs',
    phone: '+1 (555) 456-7890',
    email: 'info@commhealth.com',
    totalBeds: 200,
    availableBeds: 10,
    occupancyRate: 95,
    emergencyCapacity: false,
    specialties: ['Primary Care', 'Pediatrics', 'Emergency Care'],
    staffCount: 150,
    status: 'full',
    lastUpdated: '15 minutes ago',
    coordinates: [40.7829, -73.9654],
    stats: {
      totalPatients: 190,
      avgWaitTime: 45,
      emergencyResponses: 15,
      occupancyTrend: [85, 88, 90, 92, 94, 95]
    },
    departments: [
      {
        name: 'Emergency',
        beds: { total: 50, available: 10 },
        status: 'critical',
      },
      {
        name: 'Pediatrics',
        beds: { total: 30, available: 5 },
        status: 'critical',
      },
      {
        name: 'Primary Care',
        beds: { total: 100, available: 45 },
        status: 'stable',
      },
    ],
  }
];

const specialtyOptions = [
  'Trauma',
  'Cardiac',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'General Care',
  'Family Medicine',
];

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add custom styles
const styles = {
  headerPaper: {
    p: 4,
    mb: 4,
    background: theme => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: 'white',
    borderRadius: 3,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  statsCard: {
    bgcolor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
  },
  filterPaper: {
    p: 3,
    mb: 4,
    borderRadius: 2,
    border: theme => `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  hospitalCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    border: theme => `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    },
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      backgroundColor: theme => theme.palette.primary.main,
      color: 'white',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  },
  speedDial: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    '& .MuiFab-primary': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  },
};

const Hospitals = () => {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'analytics'>('list');
  const [filterStatus, setFilterStatus] = useState<Hospital['status'] | 'all'>('all');
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState<HospitalStats | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Filter hospitals based on search and filters
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || hospital.status === filterStatus;
    const matchesEmergency = !filterEmergencyOnly || hospital.emergencyCapacity;
    return matchesSearch && matchesStatus && matchesEmergency;
  });

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates by randomly updating some values
      setHospitals(prevHospitals => prevHospitals.map(hospital => ({
        ...hospital,
        availableBeds: Math.max(0, hospital.availableBeds + Math.floor(Math.random() * 3) - 1),
        lastUpdated: 'Just now'
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAddHospital = () => {
    setSelectedHospital(null);
    setDialogOpen(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedHospital(null);
  };

  const getStatusColor = (status: Hospital['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success;
      case 'limited':
        return theme.palette.warning;
      case 'full':
        return theme.palette.error;
      default:
        return theme.palette.info;
    }
  };

  const handleViewStats = (hospital: Hospital) => {
    setSelectedStats(hospital.stats);
    setStatsDialogOpen(true);
  };

  const actions = [
    { icon: <AddIcon />, name: 'Add Hospital', handler: handleAddHospital },
    { icon: <MedicalIcon />, name: 'View Analytics', handler: () => {} },
    { icon: <EmergencyIcon />, name: 'Emergency Protocol', handler: () => {} },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Hospital Network
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddHospital}
            >
              Add Hospital
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ mb: 3, p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value as Hospital['status'] | 'all')}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="limited">Limited</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={filterEmergencyOnly}
                  onChange={(e) => setFilterEmergencyOnly(e.target.checked)}
                />
              }
              label="Emergency Capacity Only"
            />
            <Stack direction="row" spacing={1}>
              <Tooltip title="List View">
                <IconButton 
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Map View">
                <IconButton
                  color={viewMode === 'map' ? 'primary' : 'default'}
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Analytics">
                <IconButton
                  color={viewMode === 'analytics' ? 'primary' : 'default'}
                  onClick={() => setViewMode('analytics')}
                >
                  <AssessmentIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Card>

        {viewMode === 'map' && (
          <Card sx={{ height: 600, mb: 3 }}>
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredHospitals.map((hospital) => (
                <Marker
                  key={hospital.id}
                  position={hospital.coordinates}
                >
                  <Popup>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2">
                      Available Beds: {hospital.availableBeds}
                    </Typography>
                    <Typography variant="body2">
                      Status: {hospital.status.toUpperCase()}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleViewStats(hospital)}
                      sx={{ mt: 1 }}
                    >
                      View Stats
                    </Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="overline" color="success">Total Capacity</Typography>
                  <Typography variant="h3">
                    {hospitals.reduce((sum, h) => sum + h.totalBeds, 0)}
                  </Typography>
                  <Chip
                    label={`${hospitals.length} Facilities`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="overline" color="warning">Available Beds</Typography>
                  <Typography variant="h3">
                    {hospitals.reduce((sum, h) => sum + h.availableBeds, 0)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="overline" color="primary">Total Staff</Typography>
                  <Typography variant="h3">
                    {hospitals.reduce((sum, h) => sum + h.staffCount, 0)}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="Medical Staff"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Hospital List */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="All Hospitals" />
                  <Tab label="Critical Status" />
                  <Tab label="Available Beds" />
                </Tabs>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Hospital</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Emergency Capacity</TableCell>
                        <TableCell>Departments Status</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHospitals.map((hospital) => (
                        <TableRow
                          key={hospital.id}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <HospitalIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                              <Typography variant="subtitle2">{hospital.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.grey[500] }} />
                              {hospital.location}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmergencyIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                              <Typography>
                                {hospital.availableBeds} / {hospital.totalBeds}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {hospital.departments.map((dept) => (
                                <Tooltip
                                  key={dept.name}
                                  title={`${dept.name}: ${dept.beds.available}/${dept.beds.total} beds available`}
                                >
                                  <Box>
                                    <StatusBadge status={dept.status} size="small" />
                                  </Box>
                                </Tooltip>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.grey[500] }} />
                                {hospital.phone}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.grey[500] }} />
                                {hospital.email}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditHospital(hospital)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      <SpeedDial
        ariaLabel="Quick Actions"
        sx={styles.speedDial}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handler}
          />
        ))}
      </SpeedDial>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedHospital ? 'Edit Hospital' : 'Add New Hospital'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hospital Name"
                defaultValue={selectedHospital?.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                defaultValue={selectedHospital?.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                defaultValue={selectedHospital?.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                defaultValue={selectedHospital?.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Beds"
                type="number"
                defaultValue={selectedHospital?.totalBeds}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Available Beds"
                type="number"
                defaultValue={selectedHospital?.availableBeds}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedHospital ? 'Save Changes' : 'Add Hospital'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statsDialogOpen}
        onClose={() => setStatsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Hospital Statistics</DialogTitle>
        <DialogContent>
          {selectedStats && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Patients
                  </Typography>
                  <Typography variant="h4">
                    {selectedStats.totalPatients}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Average Wait Time
                  </Typography>
                  <Typography variant="h4">
                    {selectedStats.avgWaitTime} min
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary" mb={2}>
                    Occupancy Trend
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedStats.occupancyTrend[selectedStats.occupancyTrend.length - 1]}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Hospitals; 