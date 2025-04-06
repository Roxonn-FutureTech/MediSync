import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Search,
  Warning as EmergencyIcon,
  Add as AddIcon,
  DirectionsRun,
  LocalHospital,
  AccessTime,
  LocationOn,
  Phone,
  Speed,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatusBadge from '../../components/common/StatusBadge';
import StatCard from '../../components/common/StatCard';

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

const Emergencies = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencies, setEmergencies] = useState<Emergency[]>(mockEmergencies);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    status: 'pending' as Emergency['status'],
    patientName: '',
    patientAge: '',
    patientCondition: '',
    team: '',
    teamContact: '',
    hospitalName: '',
    hospitalDistance: '',
    hospitalEta: '',
    priority: '2',
  });

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  // Handle new emergency button click
  const handleNewEmergency = () => {
    setSelectedEmergency(null);
    setFormData({
      type: '',
      location: '',
      status: 'pending',
      patientName: '',
      patientAge: '',
      patientCondition: '',
      team: '',
      teamContact: '',
      hospitalName: '',
      hospitalDistance: '',
      hospitalEta: '',
      priority: '2',
    });
    setDialogOpen(true);
  };

  // Handle edit emergency
  const handleEditEmergency = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setFormData({
      type: emergency.type,
      location: emergency.location,
      status: emergency.status,
      patientName: emergency.patient.name,
      patientAge: emergency.patient.age.toString(),
      patientCondition: emergency.patient.condition,
      team: emergency.assignedTo.team,
      teamContact: emergency.assignedTo.contact,
      hospitalName: emergency.hospital.name,
      hospitalDistance: emergency.hospital.distance,
      hospitalEta: emergency.hospital.eta,
      priority: emergency.priority.toString(),
    });
    setDialogOpen(true);
  };

  // Handle save emergency
  const handleSaveEmergency = () => {
    const newEmergency: Emergency = {
      id: selectedEmergency ? selectedEmergency.id : emergencies.length + 1,
      type: formData.type,
      location: formData.location,
      status: formData.status,
      patient: {
        name: formData.patientName,
        age: parseInt(formData.patientAge),
        condition: formData.patientCondition,
      },
      assignedTo: {
        team: formData.team,
        contact: formData.teamContact,
      },
      hospital: {
        name: formData.hospitalName,
        distance: formData.hospitalDistance,
        eta: formData.hospitalEta,
      },
      responseTime: selectedEmergency ? selectedEmergency.responseTime : 'Just now',
      priority: parseInt(formData.priority),
    };

    if (selectedEmergency) {
      // Update existing emergency
      setEmergencies(prevEmergencies => 
        prevEmergencies.map(emergency => 
          emergency.id === selectedEmergency.id ? newEmergency : emergency
        )
      );
    } else {
      // Add new emergency
      setEmergencies(prevEmergencies => [...prevEmergencies, newEmergency]);
    }

    setDialogOpen(false);
  };

  const filteredEmergencies = emergencies.filter(emergency => 
    emergency.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emergency.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emergency.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Emergency Response Center</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewEmergency}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          New Emergency
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Emergencies"
            value={emergencies.length}
            icon={<EmergencyIcon />}
            color="error"
            trend={{ value: 20, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Teams"
            value={8}
            icon={<DirectionsRun />}
            color="success"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Response Time"
            value="4.5 min"
            icon={<AccessTime />}
            color="warning"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value="94%"
            icon={<Speed />}
            color="info"
            trend={{ value: 3, isPositive: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3 }}
          >
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmergencies.map((emergency) => (
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
                            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
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
                          <Typography variant="body2">{emergency.hospital.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={`Distance: ${emergency.hospital.distance}`}>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{emergency.hospital.distance}</Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title={`ETA: ${emergency.hospital.eta}`}>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{emergency.hospital.eta}</Typography>
                              </Box>
                            </Tooltip>
                          </Box>
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
                      <TableCell>
                        <Tooltip title="Edit Emergency">
                          <IconButton
                            size="small"
                            onClick={() => handleEditEmergency(emergency)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Emergency Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEmergency ? 'Edit Emergency' : 'Add New Emergency'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Type"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleFormChange}
                >
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="stable">Stable</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleFormChange}
                >
                  <MenuItem value="1">High (1)</MenuItem>
                  <MenuItem value="2">Medium (2)</MenuItem>
                  <MenuItem value="3">Low (3)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Patient Information</Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Patient Name"
                name="patientName"
                value={formData.patientName}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Age"
                name="patientAge"
                type="number"
                value={formData.patientAge}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Condition"
                name="patientCondition"
                value={formData.patientCondition}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Team Assignment</Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assigned Team"
                name="team"
                value={formData.team}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Contact"
                name="teamContact"
                value={formData.teamContact}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Hospital Information</Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hospital Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Distance"
                name="hospitalDistance"
                value={formData.hospitalDistance}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="ETA"
                name="hospitalEta"
                value={formData.hospitalEta}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEmergency}
            disabled={!formData.type || !formData.patientName || !formData.team || !formData.hospitalName}
          >
            {selectedEmergency ? 'Update Emergency' : 'Add Emergency'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Emergencies; 