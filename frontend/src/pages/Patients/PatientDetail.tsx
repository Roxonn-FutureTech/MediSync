import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  LocalHospital,
  AccessTime,
  CalendarMonth,
  FilePresent,
  Medication,
  Note,
  Schedule,
  Event,
  BarChart,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
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

// Mock patient data
const mockPatient = {
  id: '1',
  name: 'Sarah Johnson',
  age: 42,
  gender: 'Female',
  bloodType: 'A+',
  address: '123 Main St, Anytown, USA',
  phone: '(555) 123-4567',
  email: 'sarah.johnson@example.com',
  emergencyContact: 'Robert Johnson (Husband) - (555) 987-6543',
  medicalHistory: [
    { condition: 'Hypertension', diagnosedDate: '2018-05-12', status: 'Active' },
    { condition: 'Type 2 Diabetes', diagnosedDate: '2019-03-22', status: 'Active' },
    { condition: 'Appendicitis', diagnosedDate: '2010-11-03', status: 'Resolved' },
  ],
  medications: [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2018-05-15' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2019-03-25' },
  ],
  visits: [
    { date: '2023-02-15', reason: 'Regular checkup', doctor: 'Dr. Alice Chen', notes: 'Blood pressure normal, advised regular exercise.' },
    { date: '2022-11-10', reason: 'Flu symptoms', doctor: 'Dr. John Smith', notes: 'Prescribed antivirals and rest.' },
    { date: '2022-08-22', reason: 'Diabetes follow-up', doctor: 'Dr. Alice Chen', notes: 'A1C improved, continuing current medication.' },
  ],
  upcomingAppointments: [
    { date: '2023-05-16', time: '10:30 AM', doctor: 'Dr. Alice Chen', reason: 'Quarterly Diabetes Check' },
  ],
  allergies: ['Penicillin', 'Sulfa drugs'],
  vitalSigns: {
    bloodPressure: '125/82 mmHg',
    heartRate: '72 bpm',
    respiratoryRate: '14 breaths/min',
    temperature: '98.6°F',
    oxygenSaturation: '98%',
    height: '5\'6"',
    weight: '145 lbs',
    bmi: '23.4',
  },
};

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(mockPatient);

  useEffect(() => {
    // Simulate API call to fetch patient data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/patients');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="gpu-accelerated"
    >
      <Box sx={{ pb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Patients
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              {loading ? (
                <Skeleton variant="circular" width={80} height={80} />
              ) : (
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha(theme.palette.primary.main, 0.8),
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {patient.name.charAt(0)}
                </Avatar>
              )}
            </Grid>
            <Grid item xs>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="40%" height={24} />
                </>
              ) : (
                <>
                  <Typography variant="h4" fontWeight="bold">
                    {patient.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${patient.age} years`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={patient.gender}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Blood: ${patient.bloodType}`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                    {patient.allergies.map((allergy) => (
                      <Chip
                        key={allergy}
                        label={`Allergic to ${allergy}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
            </Grid>
            <Grid item>
              {!loading && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ borderRadius: 2 }}
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2,
                borderRadius: '8px 8px 0 0',
                fontWeight: 600,
                textTransform: 'none',
              },
            }}
          >
            <Tab icon={<LocalHospital sx={{ fontSize: 20 }} />} iconPosition="start" label="Overview" />
            <Tab icon={<FilePresent sx={{ fontSize: 20 }} />} iconPosition="start" label="Medical History" />
            <Tab icon={<Medication sx={{ fontSize: 20 }} />} iconPosition="start" label="Medications" />
            <Tab icon={<Note sx={{ fontSize: 20 }} />} iconPosition="start" label="Visits" />
            <Tab icon={<Schedule sx={{ fontSize: 20 }} />} iconPosition="start" label="Appointments" />
            <Tab icon={<BarChart sx={{ fontSize: 20 }} />} iconPosition="start" label="Vitals" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                  overflow: 'hidden',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {loading ? (
                    <>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </>
                  ) : (
                    <List disablePadding>
                      <ListItem disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Address"
                          secondary={patient.address}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Phone"
                          secondary={patient.phone}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Email"
                          secondary={patient.email}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary="Emergency Contact"
                          secondary={patient.emergencyContact}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                  overflow: 'hidden',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Upcoming Appointments
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {loading ? (
                    <>
                      <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                    </>
                  ) : (
                    <>
                      {patient.upcomingAppointments.length > 0 ? (
                        patient.upcomingAppointments.map((appointment, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              mb: index < patient.upcomingAppointments.length - 1 ? 2 : 0,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarMonth sx={{ color: theme.palette.primary.main, mr: 1 }} />
                              <Typography variant="subtitle1" fontWeight="medium">
                                {appointment.date}
                              </Typography>
                              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 18 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {appointment.time}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2">
                              {appointment.doctor} • {appointment.reason}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No upcoming appointments.
                        </Typography>
                      )}
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Event />}
                          sx={{ borderRadius: 2 }}
                        >
                          Schedule
                        </Button>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Medical History Tab */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              {patient.medicalHistory.map((item, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                    overflow: 'hidden',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {item.condition}
                      </Typography>
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'Active' ? 'error' : 'success'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Diagnosed on {new Date(item.diagnosedDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {patient.medicalHistory.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No medical history recorded.
                </Typography>
              )}
            </>
          )}
        </TabPanel>

        {/* Other tab panels would be implemented similarly */}
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              {patient.medications.map((med, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                    overflow: 'hidden',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {med.name} ({med.dosage})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {med.frequency} • Started {new Date(med.startDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {patient.medications.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No medications prescribed.
                </Typography>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              {patient.visits.map((visit, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                    overflow: 'hidden',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {visit.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(visit.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      {visit.doctor}
                    </Typography>
                    <Typography variant="body2">
                      {visit.notes}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {patient.visits.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No visits recorded.
                </Typography>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography>Appointments tab content</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Typography>Vitals tab content</Typography>
        </TabPanel>
      </Box>
    </motion.div>
  );
};

export default PatientDetail; 