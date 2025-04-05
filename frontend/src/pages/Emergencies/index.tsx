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

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Emergency Response Center</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          New Emergency
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Emergencies"
            value={12}
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Emergencies; 