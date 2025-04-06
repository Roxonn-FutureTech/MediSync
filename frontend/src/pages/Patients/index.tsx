import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  condition: string;
  severity: 'Critical' | 'Moderate' | 'Stable';
  admissionDate: string;
  assignedDoctor: string;
  assignedHospital: string;
  roomNumber: string;
  status: 'Admitted' | 'In Treatment' | 'Discharged' | 'Transfer';
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  lastUpdate: string;
}

// Mock data
const initialPatients: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    gender: "Male",
    bloodType: "A+",
    condition: "Cardiac Arrest",
    severity: "Critical",
    admissionDate: "2024-03-15",
    assignedDoctor: "Dr. Sarah Johnson",
    assignedHospital: "Central Hospital",
    roomNumber: "ICU-101",
    status: "Admitted",
    medicalHistory: ["Hypertension", "Diabetes Type 2"],
    currentMedications: ["Aspirin", "Metformin"],
    allergies: ["Penicillin"],
    lastUpdate: "10 minutes ago"
  },
  {
    id: 2,
    name: "Emma Davis",
    age: 28,
    gender: "Female",
    bloodType: "O-",
    condition: "Multiple Trauma",
    severity: "Critical",
    admissionDate: "2024-03-15",
    assignedDoctor: "Dr. Michael Chen",
    assignedHospital: "Central Hospital",
    roomNumber: "ER-205",
    status: "In Treatment",
    medicalHistory: ["None"],
    currentMedications: ["Morphine", "Antibiotics"],
    allergies: [],
    lastUpdate: "5 minutes ago"
  }
];

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    condition: '',
    severity: 'Stable' as Patient['severity'],
    admissionDate: new Date().toISOString().split('T')[0],
    assignedDoctor: '',
    assignedHospital: '',
    roomNumber: '',
    status: 'Admitted' as Patient['status'],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setOpenDialog(true);
  };

  // Add form change handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  // Update handleEditPatient to populate form data
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      bloodType: patient.bloodType,
      condition: patient.condition,
      severity: patient.severity,
      admissionDate: patient.admissionDate,
      assignedDoctor: patient.assignedDoctor,
      assignedHospital: patient.assignedHospital,
      roomNumber: patient.roomNumber,
      status: patient.status,
    });
    setOpenDialog(true);
  };

  // Update handleSavePatient to properly save data
  const handleSavePatient = () => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(prev => 
        prev.map(patient => 
          patient.id === selectedPatient.id
            ? {
                ...patient,
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender,
                bloodType: formData.bloodType,
                condition: formData.condition,
                severity: formData.severity,
                admissionDate: formData.admissionDate,
                assignedDoctor: formData.assignedDoctor,
                assignedHospital: formData.assignedHospital,
                roomNumber: formData.roomNumber,
                status: formData.status,
                lastUpdate: 'Just now'
              }
            : patient
        )
      );
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: patients.length + 1,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodType: formData.bloodType,
        condition: formData.condition,
        severity: formData.severity,
        admissionDate: formData.admissionDate,
        assignedDoctor: formData.assignedDoctor,
        assignedHospital: formData.assignedHospital,
        roomNumber: formData.roomNumber,
        status: formData.status,
        medicalHistory: [],
        currentMedications: [],
        allergies: [],
        lastUpdate: 'Just now'
      };
      setPatients(prev => [...prev, newPatient]);
    }
    
    // Reset form and close dialog
    setFormData({
      name: '',
      age: '',
      gender: '',
      bloodType: '',
      condition: '',
      severity: 'Stable',
      admissionDate: new Date().toISOString().split('T')[0],
      assignedDoctor: '',
      assignedHospital: '',
      roomNumber: '',
      status: 'Admitted',
    });
    setSelectedPatient(null);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPatient}
          sx={{ px: 3, py: 1 }}
        >
          Add Patient
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search patients by name or condition..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Patients</MenuItem>
              <MenuItem value="Admitted">Admitted</MenuItem>
              <MenuItem value="In Treatment">In Treatment</MenuItem>
              <MenuItem value="Discharged">Discharged</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Patients" />
        <Tab label="Critical Cases" />
        <Tab label="Recent Admissions" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredPatients.map((patient) => (
          <Grid item xs={12} md={6} lg={4} key={patient.id}>
            <Card 
              sx={{ 
                position: 'relative',
                '&:hover': { boxShadow: 6 },
                transition: 'box-shadow 0.3s'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.age} years • {patient.gender} • {patient.bloodType}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={() => handleEditPatient(patient)}>
                    <EditIcon />
                  </IconButton>
                </Box>

                <Chip
                  label={patient.severity}
                  color={
                    patient.severity === 'Critical' ? 'error' :
                    patient.severity === 'Moderate' ? 'warning' : 'success'
                  }
                  sx={{ mb: 2 }}
                />

                <List sx={{ p: 0 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        <HospitalIcon color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={patient.assignedHospital}
                      secondary={`Room ${patient.roomNumber}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        <AssignmentIcon color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={patient.condition}
                      secondary={patient.assignedDoctor}
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Medical History
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {patient.medicalHistory.map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={patient.status}
                    color={
                      patient.status === 'Admitted' ? 'info' :
                      patient.status === 'In Treatment' ? 'warning' :
                      patient.status === 'Discharged' ? 'success' : 'default'
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {patient.lastUpdate}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleFormChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Blood Type</InputLabel>
                <Select
                  name="bloodType"
                  value={formData.bloodType}
                  label="Blood Type"
                  onChange={handleFormChange}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Medical Condition"
                name="condition"
                value={formData.condition}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={formData.severity}
                  label="Severity"
                  onChange={handleFormChange}
                >
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Stable">Stable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assigned Doctor"
                name="assignedDoctor"
                value={formData.assignedDoctor}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assigned Hospital"
                name="assignedHospital"
                value={formData.assignedHospital}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleFormChange}
                >
                  <MenuItem value="Admitted">Admitted</MenuItem>
                  <MenuItem value="In Treatment">In Treatment</MenuItem>
                  <MenuItem value="Discharged">Discharged</MenuItem>
                  <MenuItem value="Transfer">Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Admission Date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePatient} 
            variant="contained"
            disabled={!formData.name || !formData.age || !formData.gender || !formData.bloodType || !formData.condition}
          >
            {selectedPatient ? 'Update Patient' : 'Add Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 