import { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { Hospital } from '../HospitalDashboard';

interface HospitalListProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
}

const HospitalList: FC<HospitalListProps> = ({ hospitals, onViewDetails }) => {
  const theme = useTheme();
  
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
  
  return (
    <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Hospital</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Beds</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Distance</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hospitals.map((hospital) => {
            const statusColor = getStatusColor(hospital.status);
            return (
              <TableRow 
                key={hospital.id}
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => onViewDetails(hospital)}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={hospital.image}
                      alt={hospital.name}
                      sx={{ width: 56, height: 56, borderRadius: 1 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {hospital.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <LocationIcon fontSize="inherit" />
                        {hospital.address}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    icon={getStatusIcon(hospital.status)}
                    label={hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                    size="small"
                    sx={{
                      bgcolor: alpha(statusColor.main, 0.1),
                      color: statusColor.main,
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: statusColor.main
                      }
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  <Chip
                    icon={<HospitalIcon fontSize="small" />}
                    label={hospital.type}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {hospital.stats.availableBeds} 
                    <Typography component="span" variant="caption" color="text.secondary"> available</Typography>
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ width: 100 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={hospital.stats.occupancyRate} 
                        sx={{
                          width: '100%',
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: hospital.stats.occupancyRate > 90 
                              ? theme.palette.error.main 
                              : hospital.stats.occupancyRate > 70 
                                ? theme.palette.warning.main 
                                : theme.palette.success.main,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {hospital.stats.occupancyRate}% occupied
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      {hospital.distance} miles
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Stack spacing={1}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <PhoneIcon fontSize="small" color="primary" />
                      {hospital.phone}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <EmailIcon fontSize="small" color="primary" />
                      {hospital.email}
                    </Typography>
                  </Stack>
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(hospital);
                      }}
                      color="primary"
                      size="small"
                      sx={{ 
                        border: 1, 
                        borderColor: alpha(theme.palette.primary.main, 0.25)
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HospitalList; 