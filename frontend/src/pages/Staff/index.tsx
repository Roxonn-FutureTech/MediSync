import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Container,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SupervisorAccount as ManagerIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as NurseIcon,
  Psychology as TherapistIcon,
  Engineering as TechnicianIcon,
  Healing as StaffIcon,
  EventNote as ScheduleIcon,
  Assessment as ReportIcon,
  Mail as EmailIcon,
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  WorkOutline as RoleIcon,
  Sort as SortIcon,
  ViewList as ListView,
  ViewModule as GridView,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Simulated data structure
interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  status: string;
  shift: string;
  specialization: string;
  email: string;
  phone: string;
  joiningDate: string;
  employeeId: string;
  certifications: string[];
  hospital: string;
}

// Mock data for staff members
const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Doctor',
    department: 'Cardiology',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'active',
    shift: 'Morning',
    specialization: 'Cardiologist',
    email: 'sarah.johnson@medisync.com',
    phone: '+1 (555) 123-4567',
    joiningDate: '2020-05-15',
    employeeId: 'EMP-001',
    certifications: ['MBBS', 'MD', 'FACC'],
    hospital: 'Central Hospital'
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'Nurse',
    department: 'Emergency',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'active',
    shift: 'Evening',
    specialization: 'Emergency Medicine',
    email: 'james.wilson@medisync.com',
    phone: '+1 (555) 234-5678',
    joiningDate: '2021-02-10',
    employeeId: 'EMP-002',
    certifications: ['RN', 'BLS', 'ACLS'],
    hospital: 'Central Hospital'
  },
  {
    id: '3',
    name: 'Dr. Emily Carter',
    role: 'Doctor',
    department: 'Neurology',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    status: 'on-leave',
    shift: 'Morning',
    specialization: 'Neurologist',
    email: 'emily.carter@medisync.com',
    phone: '+1 (555) 345-6789',
    joiningDate: '2019-08-20',
    employeeId: 'EMP-003',
    certifications: ['MBBS', 'MD', 'ABPN'],
    hospital: 'Central Hospital'
  },
];

// Available roles for staff members
const staffRoles = [
  'Doctor',
  'Nurse',
  'Technician',
  'Therapist',
  'Manager',
  'Administrative Staff'
];

// Department options
const departments = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Emergency',
  'Oncology',
  'Radiology',
  'Orthopedics',
  'Administration',
  'IT Support',
  'General Medicine'
];

// Hospitals
const hospitals = [
  'Central Hospital',
  'North Medical Center',
  'West General Hospital',
  'East County Medical',
  'South Memorial Hospital'
];

// Shift options
const shifts = [
  'Morning',
  'Evening',
  'Night',
  'Rotating',
  'Weekend'
];

// Status options
const statusOptions = [
  'active',
  'inactive',
  'on-leave',
  'training'
];

interface AddStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onAddStaff: (staff: StaffMember) => void;
}

const AddStaffDialog = ({ open, onClose, onAddStaff }: AddStaffDialogProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    department: '',
    status: 'active',
    shift: '',
    specialization: '',
    email: '',
    phone: '',
    hospital: '',
    certifications: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [certField, setCertField] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is corrected
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddCertification = () => {
    if (certField.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certField.trim()]
      }));
      setCertField('');
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c !== cert)
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Generate a new staff member with necessary fields
      const newStaff: StaffMember = {
        ...formData as StaffMember,
        id: `${Date.now()}`,
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        joiningDate: new Date().toISOString().split('T')[0],
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      
      onAddStaff(newStaff);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        department: '',
        status: 'active',
        shift: '',
        specialization: '',
        email: '',
        phone: '',
        hospital: '',
        certifications: []
      });
      setErrors({});
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        display: 'flex',
        alignItems: 'center'
      }}>
        <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div" fontWeight={600}>
          Add New Staff Member
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
            >
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.role} required>
              <InputLabel id="staff-role-label">Role</InputLabel>
              <Select
                labelId="staff-role-label"
                id="role"
                name="role"
                value={formData.role || ''}
                onChange={handleInputChange}
                label="Role"
              >
                {staffRoles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.department} required>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department"
                value={formData.department || ''}
                onChange={handleInputChange}
                label="Department"
              >
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
              {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
              sx={{ mt: 2 }}
            >
              Contact Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
              sx={{ mt: 2 }}
            >
              Employment Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="hospital-label">Hospital</InputLabel>
              <Select
                labelId="hospital-label"
                id="hospital"
                name="hospital"
                value={formData.hospital || ''}
                onChange={handleInputChange}
                label="Hospital"
              >
                {hospitals.map(hospital => (
                  <MenuItem key={hospital} value={hospital}>{hospital}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="shift-label">Shift</InputLabel>
              <Select
                labelId="shift-label"
                id="shift"
                name="shift"
                value={formData.shift || ''}
                onChange={handleInputChange}
                label="Shift"
              >
                {shifts.map(shift => (
                  <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status || 'active'}
                onChange={handleInputChange}
                label="Status"
              >
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Certifications & Qualifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label="Add certification"
                value={certField}
                onChange={(e) => setCertField(e.target.value)}
                variant="outlined"
                size="small"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCertification();
                  }
                }}
              />
              <Button 
                variant="outlined"
                onClick={handleAddCertification}
                sx={{ ml: 1, whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(formData.certifications || []).map((cert, index) => (
                <Chip
                  key={index}
                  label={cert}
                  onDelete={() => handleRemoveCertification(cert)}
                  variant="outlined"
                />
              ))}
              {(formData.certifications || []).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No certifications added
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Staff Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Staff = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaff);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const handleAddStaff = (newStaff: StaffMember) => {
    setStaffMembers(prev => [...prev, newStaff]);
  };

  const filteredStaff = staffMembers.filter(staff => {
    // Apply search
    const searchMatches = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply department filter
    const departmentMatches = selectedDepartment === 'all' || staff.department === selectedDepartment;
    
    // Apply role filter
    const roleMatches = selectedRole === 'all' || staff.role === selectedRole;
    
    return searchMatches && departmentMatches && roleMatches;
  });

  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sx={{ pl: { xs: 5, md: 3 }, pt: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Staff Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Manage medical and administrative staff
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{ 
              ml: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 10px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            Add Staff Member
          </Button>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search staff by name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.9),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 1),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.common.white, 1),
                },
                '& .MuiInputAdornment-root': {
                  marginRight: 1,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="department-filter-label">Department</InputLabel>
            <Select
              labelId="department-filter-label"
              id="department-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              label="Department"
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="all">All Roles</MenuItem>
              {staffRoles.map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Display Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {filteredStaff.length} Staff Member{filteredStaff.length !== 1 ? 's' : ''}
        </Typography>
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={(e, value) => value && setDisplayMode(value)}
          aria-label="display mode"
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridView />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ListView />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Staff Grid/List */}
      {displayMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredStaff.map((staff) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={staff.id}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      src={staff.image}
                      alt={staff.name}
                      sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h6" align="center" gutterBottom>
                      {staff.name}
                    </Typography>
                    <Chip 
                      label={staff.role} 
                      color="primary"
                      variant="outlined"
                      size="small"
                      icon={
                        staff.role === 'Doctor' ? <DoctorIcon /> :
                        staff.role === 'Nurse' ? <NurseIcon /> :
                        staff.role === 'Technician' ? <TechnicianIcon /> :
                        staff.role === 'Therapist' ? <TherapistIcon /> :
                        staff.role === 'Manager' ? <ManagerIcon /> :
                        <StaffIcon />
                      }
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" align="center">
                      {staff.department}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" noWrap>
                        {staff.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">{staff.phone}</Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip 
                      label={staff.shift} 
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={staff.status.charAt(0).toUpperCase() + staff.status.slice(1)} 
                      color={
                        staff.status === 'active' ? 'success' :
                        staff.status === 'inactive' ? 'error' :
                        'warning'
                      }
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Member</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={staff.image} alt={staff.name} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="body1">{staff.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {staff.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.role} 
                      size="small"
                      icon={
                        staff.role === 'Doctor' ? <DoctorIcon /> :
                        staff.role === 'Nurse' ? <NurseIcon /> :
                        staff.role === 'Technician' ? <TechnicianIcon /> :
                        staff.role === 'Therapist' ? <TherapistIcon /> :
                        staff.role === 'Manager' ? <ManagerIcon /> :
                        <StaffIcon />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{staff.email}</Typography>
                    <Typography variant="body2">{staff.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.status.charAt(0).toUpperCase() + staff.status.slice(1)} 
                      color={
                        staff.status === 'active' ? 'success' :
                        staff.status === 'inactive' ? 'error' :
                        'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Staff Dialog */}
      <AddStaffDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddStaff={handleAddStaff}
      />
    </Container>
  );
};

export default Staff;