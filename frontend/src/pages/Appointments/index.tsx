import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tabs,
  Tab,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  CalendarMonth,
  Person,
  LocalHospital,
  AccessTime,
  EditCalendar,
  Cancel,
  CheckCircle,
  Delete,
  FilterList,
  MoreVert,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  notes?: string;
}

// Mock appointment data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: '101',
    doctorName: 'Dr. Alice Chen',
    doctorId: '201',
    date: '2023-07-10',
    time: '10:30 AM',
    status: 'scheduled',
    type: 'Consultation',
    notes: 'Follow-up on diabetes management',
  },
  {
    id: '2',
    patientName: 'Michael Davis',
    patientId: '102',
    doctorName: 'Dr. Robert Wilson',
    doctorId: '202',
    date: '2023-07-10',
    time: '11:45 AM',
    status: 'scheduled',
    type: 'Checkup',
    notes: 'Annual physical examination',
  },
  {
    id: '3',
    patientName: 'Emily Thompson',
    patientId: '103',
    doctorName: 'Dr. Alice Chen',
    doctorId: '201',
    date: '2023-07-10',
    time: '2:15 PM',
    status: 'scheduled',
    type: 'Consultation',
    notes: 'Initial consultation for chronic pain management',
  },
  {
    id: '4',
    patientName: 'David Wilson',
    patientId: '104',
    doctorName: 'Dr. John Smith',
    doctorId: '203',
    date: '2023-07-09',
    time: '9:00 AM',
    status: 'completed',
    type: 'Procedure',
    notes: 'Suture removal from previous procedure',
  },
  {
    id: '5',
    patientName: 'Jennifer Brown',
    patientId: '105',
    doctorName: 'Dr. Robert Wilson',
    doctorId: '202',
    date: '2023-07-09',
    time: '3:30 PM',
    status: 'cancelled',
    type: 'Consultation',
    notes: 'Patient requested cancellation',
  },
  {
    id: '6',
    patientName: 'Brian Miller',
    patientId: '106',
    doctorName: 'Dr. John Smith',
    doctorId: '203',
    date: '2023-07-08',
    time: '11:00 AM',
    status: 'no-show',
    type: 'Checkup',
    notes: 'Patient did not show up for appointment',
  },
  {
    id: '7',
    patientName: 'Lisa Taylor',
    patientId: '107',
    doctorName: 'Dr. Alice Chen',
    doctorId: '201',
    date: '2023-07-11',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'Consultation',
    notes: 'New patient consultation',
  },
  {
    id: '8',
    patientName: 'Robert Jones',
    patientId: '108',
    doctorName: 'Dr. Robert Wilson',
    doctorId: '202',
    date: '2023-07-11',
    time: '1:30 PM',
    status: 'scheduled',
    type: 'Checkup',
    notes: 'Follow-up after medication change',
  },
];

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointments-tabpanel-${index}`}
      aria-labelledby={`appointments-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Appointments = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Fetch appointments data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter appointments based on tab and search
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = search === '' || 
      appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.type.toLowerCase().includes(search.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return appointment.status === 'scheduled' && matchesSearch; // Upcoming
    if (tabValue === 2) return appointment.status === 'completed' && matchesSearch; // Completed
    if (tabValue === 3) return (appointment.status === 'cancelled' || appointment.status === 'no-show') && matchesSearch; // Cancelled/No-Show
    
    return matchesSearch;
  });

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Handle adding new appointment
  const handleAddAppointment = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Get status chip color
  const getStatusChipProps = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return { color: 'primary', label: 'Scheduled' };
      case 'completed':
        return { color: 'success', label: 'Completed' };
      case 'cancelled':
        return { color: 'error', label: 'Cancelled' };
      case 'no-show':
        return { color: 'warning', label: 'No Show' };
      default:
        return { color: 'default', label: status };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="gpu-accelerated"
    >
      <Box sx={{ pb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Appointments
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleAddAppointment}
            sx={{ 
              borderRadius: 2,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            New Appointment
          </Button>
        </Box>

        {/* Statistics cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <CalendarMonth />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: `0 2px 10px ${alpha(theme.palette.success.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.05)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.success.main, 0.2),
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {appointments.filter(a => a.status === 'completed').length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Completed Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: `0 2px 10px ${alpha(theme.palette.error.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.error.main, 0.05)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                      color: theme.palette.error.main,
                      mr: 2,
                    }}
                  >
                    <Cancel />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Cancelled Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: `0 2px 10px ${alpha(theme.palette.warning.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.05)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.warning.main, 0.2),
                      color: theme.palette.warning.main,
                      mr: 2,
                    }}
                  >
                    <AccessTime />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {appointments.filter(a => a.status === 'no-show').length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No-Show Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main content */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
          }}
        >
          {/* Search and filter */}
          <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search appointments..."
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              sx={{ flexGrow: 1, minWidth: '250px' }}
            />
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              endIcon={<KeyboardArrowDown />}
              sx={{ borderRadius: 2 }}
            >
              Filter
            </Button>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                },
              }}
            >
              <Tab label="All Appointments" />
              <Tab label="Upcoming" />
              <Tab label="Completed" />
              <Tab label="Cancelled/No-Show" />
            </Tabs>
          </Box>

          {/* Tab panels */}
          <TabPanel value={tabValue} index={0}>
            <AppointmentsTable 
              appointments={filteredAppointments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              getStatusChipProps={getStatusChipProps}
              formatDate={formatDate}
              loading={loading}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <AppointmentsTable 
              appointments={filteredAppointments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              getStatusChipProps={getStatusChipProps}
              formatDate={formatDate}
              loading={loading}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <AppointmentsTable 
              appointments={filteredAppointments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              getStatusChipProps={getStatusChipProps}
              formatDate={formatDate}
              loading={loading}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <AppointmentsTable 
              appointments={filteredAppointments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              getStatusChipProps={getStatusChipProps}
              formatDate={formatDate}
              loading={loading}
            />
          </TabPanel>
        </Paper>
      </Box>

      {/* Add Appointment Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">New Appointment</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="patient-select-label">Patient</InputLabel>
                  <Select
                    labelId="patient-select-label"
                    id="patient-select"
                    label="Patient"
                    value=""
                  >
                    <MenuItem value="101">Sarah Johnson</MenuItem>
                    <MenuItem value="102">Michael Davis</MenuItem>
                    <MenuItem value="103">Emily Thompson</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="doctor-select-label">Doctor</InputLabel>
                  <Select
                    labelId="doctor-select-label"
                    id="doctor-select"
                    label="Doctor"
                    value=""
                  >
                    <MenuItem value="201">Dr. Alice Chen</MenuItem>
                    <MenuItem value="202">Dr. Robert Wilson</MenuItem>
                    <MenuItem value="203">Dr. John Smith</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="type-select-label">Appointment Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    label="Appointment Type"
                    value=""
                  >
                    <MenuItem value="Consultation">Consultation</MenuItem>
                    <MenuItem value="Checkup">Checkup</MenuItem>
                    <MenuItem value="Procedure">Procedure</MenuItem>
                    <MenuItem value="Follow-up">Follow-up</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  placeholder="Add any relevant notes about this appointment"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleCloseAddDialog} variant="contained">Schedule</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

// Appointments Table Component
interface AppointmentsTableProps {
  appointments: Appointment[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getStatusChipProps: (status: Appointment['status']) => { color: string, label: string };
  formatDate: (dateString: string) => string;
  loading: boolean;
}

const AppointmentsTable = ({
  appointments,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  getStatusChipProps,
  formatDate,
  loading
}: AppointmentsTableProps) => {
  const theme = useTheme();
  
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading appointments...</Typography>
      </Box>
    );
  }

  if (appointments.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No appointments found.</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((appointment) => {
                const statusProps = getStatusChipProps(appointment.status);
                
                return (
                  <TableRow
                    key={appointment.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 1, 
                            width: 32, 
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.7) 
                          }}
                        >
                          {appointment.patientName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {appointment.patientName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalHospital 
                          sx={{ 
                            mr: 1, 
                            fontSize: 20,
                            color: theme.palette.primary.main,
                          }} 
                        />
                        <Typography variant="body2">
                          {appointment.doctorName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={statusProps.label}
                        color={statusProps.color as any}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditCalendar />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton size="small" color="error">
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={appointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default Appointments; 