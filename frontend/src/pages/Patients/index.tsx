import React from 'react';
import { 
  Grid, 
  Typography, 
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MedicalServices,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatCard from '../../components/common/StatCard';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  status: string;
  lastVisit: string;
  doctor: string;
}

const mockPatients: Patient[] = [
  { id: 1, name: 'John Smith', age: 45, gender: 'Male', bloodType: 'O+', status: 'Stable', lastVisit: '2023-10-15', doctor: 'Dr. Jane Doe' },
  { id: 2, name: 'Sarah Johnson', age: 32, gender: 'Female', bloodType: 'A-', status: 'Critical', lastVisit: '2023-10-18', doctor: 'Dr. Michael Lee' },
  { id: 3, name: 'Robert Williams', age: 58, gender: 'Male', bloodType: 'B+', status: 'Stable', lastVisit: '2023-10-10', doctor: 'Dr. Jane Doe' },
  { id: 4, name: 'Emily Davis', age: 27, gender: 'Female', bloodType: 'AB+', status: 'Moderate', lastVisit: '2023-10-16', doctor: 'Dr. Sarah Chen' },
  { id: 5, name: 'Michael Brown', age: 41, gender: 'Male', bloodType: 'O-', status: 'Stable', lastVisit: '2023-10-12', doctor: 'Dr. John Wilson' },
  { id: 6, name: 'Jennifer Miller', age: 35, gender: 'Female', bloodType: 'A+', status: 'Pending', lastVisit: '2023-10-17', doctor: 'Dr. Michael Lee' },
  { id: 7, name: 'David Garcia', age: 52, gender: 'Male', bloodType: 'B-', status: 'Stable', lastVisit: '2023-10-11', doctor: 'Dr. Sarah Chen' },
  { id: 8, name: 'Lisa Rodriguez', age: 29, gender: 'Female', bloodType: 'O+', status: 'Completed', lastVisit: '2023-10-14', doctor: 'Dr. Jane Doe' },
];

const Patients = () => {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'stable':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'pending':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sx={{ pl: { xs: 5, md: 3 }, pt: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Patients
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Manage and monitor patient information
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
          <IconButton 
            color="primary" 
            sx={{ 
              mr: 1, 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            sx={{ 
              mr: 1, 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { backgroundColor: theme.palette.primary.dark }
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value="2,564"
            icon={<MedicalServices />}
            trend={{ value: 12, isPositive: true }}
            color="primary"
            description="Total patients registered in the system"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Patients"
            value="128"
            icon={<PersonAddIcon />}
            trend={{ value: 18, isPositive: true }}
            color="success"
            description="New patients in the last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Critical Cases"
            value="28"
            icon={<MedicalServices />}
            trend={{ value: 5, isPositive: false }}
            color="error"
            description="Patients in critical condition"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Inpatients"
            value="352"
            icon={<MedicalServices />}
            trend={{ value: 2, isPositive: true }}
            color="info"
            description="Patients currently admitted"
          />
        </Grid>
      </Grid>

      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          mb: 4,
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: theme.shadows[2]
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Age/Gender</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Blood Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Visit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPatients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => (
                    <TableRow 
                      key={patient.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.05) 
                        },
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          >
                            {patient.name.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {patient.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{`${patient.age} / ${patient.gender}`}</TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.bloodType}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.status}
                          size="small"
                          color={getStatusColor(patient.status) as any}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.doctor}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={mockPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Patients; 