import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  Avatar,
  Chip,
  LinearProgress,
  Container,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from '@mui/material';
import {
  People as StaffIcon,
  LocalHotel as BedsIcon,
  MedicalServices as MedicalIcon,
  AccessTime as TimeIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Mock data for hospitalStats
  const hospitalStats = [
    { name: 'Emergency', available: 15, total: 30 },
    { name: 'ICU', available: 5, total: 20 },
    { name: 'Surgical', available: 12, total: 40 },
    { name: 'Pediatric', available: 8, total: 25 },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { 
      id: 1, 
      type: 'emergency',
      title: 'New Emergency Admission', 
      description: 'Patient with cardiac symptoms admitted to ER',
      time: '10 minutes ago',
      severity: 'high',
      details: 'Patient #4389, Male, 58 years old, was admitted to the Emergency Room with symptoms of chest pain and shortness of breath. Initial assessment suggests possible myocardial infarction. ECG and cardiac enzyme tests have been ordered.',
    },
    { 
      id: 2, 
      type: 'transfer',
      title: 'Patient Transfer Completed', 
      description: 'Patient #1234 transferred from ER to ICU',
      time: '1 hour ago',
      severity: 'medium',
      details: 'Patient #1234, Female, 42 years old, has been successfully transferred from the Emergency Room to the Intensive Care Unit. The patient was stabilized after an initial diagnosis of severe pneumonia with respiratory distress. Continuing oxygen therapy and IV antibiotics as per protocol.',
    },
    { 
      id: 3, 
      type: 'system',
      title: 'System Maintenance', 
      description: 'Scheduled maintenance completed successfully',
      time: '3 hours ago',
      severity: 'low',
      details: 'Scheduled system maintenance completed successfully. The electronic health record system was updated to version 2.4.3. New features include improved medication reconciliation workflow and enhanced security protocols. No data loss or downtime was experienced during the update.',
    },
  ];

  // Get icon for activity type
  const getActivityIcon = (type: string, severity: string) => {
    switch (type) {
      case 'emergency':
        return <ErrorIcon color="error" />;
      case 'transfer':
        return <WarningIcon color="warning" />;
      case 'system':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationIcon color="info" />;
    }
  };
  
  // Handle card click
  const handleCardClick = (index: number) => {
    setActiveCard(index);
    // You could navigate to a detailed page or open a modal here
  };
  
  // Handle activity click
  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setDetailsOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's an overview of your hospital system.
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton sx={{ 
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            }
          }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Total Patients Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.primary.main, 0.12)}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
          onClick={() => handleCardClick(0)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), 
                color: 'primary.main',
                width: 56,
                height: 56,
              }}>
                <StaffIcon fontSize="large" />
              </Avatar>
              <Chip 
                label="+5%" 
                color="success" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: '28px'
                }} 
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>1,234</Typography>
            <Typography variant="body2" color="text.secondary">Total Patients</Typography>
          </Card>
        </Grid>

        {/* Available Beds */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.success.main, 0.12)}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.success.main, 0.2)}`,
            }
          }}
          onClick={() => handleCardClick(1)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                width: 56,
                height: 56,
              }}>
                <BedsIcon fontSize="large" />
              </Avatar>
              <Chip 
                label="+8%" 
                color="success" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: '28px'
                }} 
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>235</Typography>
            <Typography variant="body2" color="text.secondary">Available Beds</Typography>
          </Card>
        </Grid>

        {/* Emergency Cases */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.error.main, 0.12)}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.error.main, 0.2)}`,
            }
          }}
          onClick={() => handleCardClick(2)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: 'error.main',
                width: 56,
                height: 56,
              }}>
                <MedicalIcon fontSize="large" />
              </Avatar>
              <Chip 
                label="+12%" 
                color="error" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: '28px'
                }} 
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>23</Typography>
            <Typography variant="body2" color="text.secondary">Emergency Cases</Typography>
          </Card>
        </Grid>

        {/* Response Time */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.info.main, 0.12)}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.info.main, 0.2)}`,
            }
          }}
          onClick={() => handleCardClick(3)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: 'info.main',
                width: 56,
                height: 56,
              }}>
                <TimeIcon fontSize="large" />
              </Avatar>
              <Chip 
                label="-8%" 
                color="info" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: '28px'
                }} 
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>42</Typography>
            <Typography variant="body2" color="text.secondary">Avg. Wait Time (min)</Typography>
          </Card>
        </Grid>

        {/* Hospital Capacity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Hospital Capacity</Typography>
              <Tooltip title="View detailed capacity report">
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <ArrowForwardIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              {hospitalStats.map((stat) => {
                const availabilityPercent = (stat.available / stat.total) * 100;
                const statusColor = availabilityPercent < 30 ? "error" : availabilityPercent < 60 ? "warning" : "success";
                
                return (
                  <Grid item xs={12} sm={6} key={stat.name}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.divider, 0.1),
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: (theme) => `0 4px 12px -2px ${alpha(theme.palette.divider, 0.2)}`,
                      }
                    }}
                    onClick={() => console.log(`Viewing details for ${stat.name}`)}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>{stat.name}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>{stat.available}</Typography>
                        <Typography color="text.secondary" variant="body2">of {stat.total}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={availabilityPercent} 
                        color={statusColor}
                        sx={{ height: 8, borderRadius: 4 }} 
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                        <Typography variant="caption" color={`${statusColor}.main`} sx={{ fontWeight: 600 }}>
                          {availabilityPercent.toFixed(0)}% Available
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3,
            height: '100%',
            borderRadius: 2,
            boxShadow: (theme) => `0 6px 16px -4px ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Recent Activities</Typography>
              <Tooltip title="View all activities">
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <ArrowForwardIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      px: 0, 
                      py: 1.5,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: (theme) => {
                          switch (activity.severity) {
                            case 'high': return alpha(theme.palette.error.main, 0.1);
                            case 'medium': return alpha(theme.palette.warning.main, 0.1);
                            case 'low': return alpha(theme.palette.success.main, 0.1);
                            default: return alpha(theme.palette.primary.main, 0.1);
                          }
                        },
                        color: (theme) => {
                          switch (activity.severity) {
                            case 'high': return theme.palette.error.main;
                            case 'medium': return theme.palette.warning.main;
                            case 'low': return theme.palette.success.main;
                            default: return theme.palette.primary.main;
                          }
                        }
                      }}>
                        {getActivityIcon(activity.type, activity.severity)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block', fontStyle: 'italic' }}>
                            {activity.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Tooltip title="More actions">
                      <IconButton size="small" onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Show actions for activity ${activity.id}`);
                      }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                  {index < recentActivities.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        {selectedActivity && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: (theme) => {
                switch (selectedActivity.severity) {
                  case 'high': return alpha(theme.palette.error.main, 0.05);
                  case 'medium': return alpha(theme.palette.warning.main, 0.05);
                  case 'low': return alpha(theme.palette.success.main, 0.05);
                  default: return alpha(theme.palette.primary.main, 0.05);
                }
              }
            }}>
              <Avatar sx={{ 
                bgcolor: (theme) => {
                  switch (selectedActivity.severity) {
                    case 'high': return alpha(theme.palette.error.main, 0.1);
                    case 'medium': return alpha(theme.palette.warning.main, 0.1);
                    case 'low': return alpha(theme.palette.success.main, 0.1);
                    default: return alpha(theme.palette.primary.main, 0.1);
                  }
                },
                color: (theme) => {
                  switch (selectedActivity.severity) {
                    case 'high': return theme.palette.error.main;
                    case 'medium': return theme.palette.warning.main;
                    case 'low': return theme.palette.success.main;
                    default: return theme.palette.primary.main;
                  }
                }
              }}>
                {getActivityIcon(selectedActivity.type, selectedActivity.severity)}
              </Avatar>
              <Typography variant="h6">{selectedActivity.title}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>Time</Typography>
                <Typography variant="body2" component="span" sx={{ display: 'block' }}>{selectedActivity.time}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>Priority</Typography>
                <Chip 
                  label={selectedActivity.severity.charAt(0).toUpperCase() + selectedActivity.severity.slice(1)} 
                  size="small"
                  color={
                    selectedActivity.severity === 'high' ? 'error' : 
                    selectedActivity.severity === 'medium' ? 'warning' : 'success'
                  }
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>Details</Typography>
                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 0.5 }}>{selectedActivity.details}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setDetailsOpen(false)}
                sx={{ textTransform: 'none' }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  setDetailsOpen(false);
                  console.log(`Taking action on ${selectedActivity.title}`);
                }}
              >
                Take Action
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard; 