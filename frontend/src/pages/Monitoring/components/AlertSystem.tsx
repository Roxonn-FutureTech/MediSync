import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Divider,
  IconButton,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Error as ErrorIcon,
  Warning,
  Info,
  Settings,
  Add,
  Delete,
  Edit,
  Email,
  Phone,
  Chat,
  Send,
  Refresh,
  FilterList,
  Person,
  AccessTime,
  CheckCircle,
  StorageRounded,
} from '@mui/icons-material';

// Mock alert history data
const alertHistory = [
  {
    id: 'ALT001',
    timestamp: '2025-04-07 11:23:45',
    severity: 'Critical',
    source: 'Database',
    message: 'High database CPU usage detected (95%)',
    status: 'Active',
    recipients: ['System Admin', 'Database Team'],
  },
  {
    id: 'ALT002',
    timestamp: '2025-04-07 10:15:22',
    severity: 'Warning',
    source: 'API Gateway',
    message: 'Increased API error rate (5.2%)',
    status: 'Active',
    recipients: ['System Admin', 'API Team'],
  },
  {
    id: 'ALT003',
    timestamp: '2025-04-07 09:45:13',
    severity: 'Info',
    source: 'Auth Service',
    message: 'Authentication service restarted',
    status: 'Resolved',
    recipients: ['System Admin'],
  },
  {
    id: 'ALT004',
    timestamp: '2025-04-07 08:30:05',
    severity: 'Critical',
    source: 'Network',
    message: 'Network connectivity issues in East datacenter',
    status: 'Resolved',
    recipients: ['System Admin', 'Network Team', 'On-call Engineer'],
  },
  {
    id: 'ALT005',
    timestamp: '2025-04-06 22:12:38',
    severity: 'Warning',
    source: 'Storage',
    message: 'Storage capacity reaching threshold (85%)',
    status: 'Active',
    recipients: ['System Admin', 'Storage Team'],
  },
];

// Alert rule configuration
const alertRules = [
  {
    id: 1,
    name: 'High CPU Usage',
    metric: 'CPU Usage',
    condition: 'above',
    threshold: '90',
    duration: '5',
    severity: 'Critical',
    enabled: true,
    notifications: ['email', 'sms'],
  },
  {
    id: 2,
    name: 'Low Memory',
    metric: 'Available Memory',
    condition: 'below',
    threshold: '500',
    duration: '10',
    severity: 'Warning',
    enabled: true,
    notifications: ['email'],
  },
  {
    id: 3,
    name: 'API Error Rate',
    metric: 'Error Rate',
    condition: 'above',
    threshold: '5',
    duration: '2',
    severity: 'Critical',
    enabled: true,
    notifications: ['email', 'sms', 'chat'],
  },
  {
    id: 4,
    name: 'Disk Space',
    metric: 'Free Disk Space',
    condition: 'below',
    threshold: '10',
    duration: '15',
    severity: 'Warning',
    enabled: false,
    notifications: ['email'],
  },
];

// Alert channels
const notificationChannels = [
  {
    type: 'email',
    recipients: ['alerts@medisync.com', 'admin@medisync.com'],
    enabled: true,
  },
  {
    type: 'sms',
    recipients: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    enabled: true,
  },
  {
    type: 'chat',
    recipients: ['#alerts', '#operations'],
    enabled: true,
  },
];

const AlertSystem: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'channels'>('alerts');
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return theme.palette.error.main;
      case 'Warning':
        return theme.palette.warning.main;
      case 'Info':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <ErrorIcon fontSize="small" />;
      case 'Warning':
        return <Warning fontSize="small" />;
      case 'Info':
        return <Info fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={activeTab === 'alerts' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('alerts')}
          startIcon={<NotificationsActive />}
          sx={{ borderRadius: '8px' }}
        >
          Active Alerts
        </Button>
        <Button
          variant={activeTab === 'rules' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('rules')}
          startIcon={<Settings />}
          sx={{ borderRadius: '8px' }}
        >
          Alert Rules
        </Button>
        <Button
          variant={activeTab === 'channels' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('channels')}
          startIcon={<Send />}
          sx={{ borderRadius: '8px' }}
        >
          Notification Channels
        </Button>
      </Box>

      {/* Alerts Table */}
      {activeTab === 'alerts' && (
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={600}>Alert History</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<Refresh />} size="small">Refresh</Button>
                <Button startIcon={<FilterList />} size="small">Filter</Button>
              </Box>
            </Box>
            <Divider />
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Recipients</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertHistory.map((alert) => (
                    <TableRow 
                      key={alert.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                        ...(alert.status === 'Resolved' && {
                          opacity: 0.7,
                          backgroundColor: alpha(theme.palette.success.main, 0.05),
                        }),
                      }}
                    >
                      <TableCell>{alert.id}</TableCell>
                      <TableCell>{alert.timestamp}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getSeverityIcon(alert.severity)}
                          label={alert.severity}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getSeverityColor(alert.severity), 0.1),
                            color: getSeverityColor(alert.severity),
                            fontWeight: 500,
                            borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell>{alert.source}</TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alert.message}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.status}
                          size="small"
                          color={alert.status === 'Active' ? 'error' : 'success'}
                          sx={{ fontWeight: 500, borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        {alert.recipients.map((recipient, index) => (
                          <Chip
                            key={index}
                            label={recipient}
                            size="small"
                            sx={{ 
                              mr: 0.5, 
                              mb: 0.5,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Alert Rules */}
      {activeTab === 'rules' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 2,
              height: '100%',
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>Alert Rules</Typography>
                  <Button 
                    startIcon={<Add />} 
                    variant="contained" 
                    color="primary"
                    size="small"
                    sx={{ borderRadius: '8px' }}
                  >
                    Add Rule
                  </Button>
                </Box>
                <List>
                  {alertRules.map((rule) => (
                    <Paper
                      key={rule.id}
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        ...(selectedRule === rule.id && {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }),
                      }}
                    >
                      <ListItem 
                        button 
                        onClick={() => setSelectedRule(rule.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        <ListItemIcon>
                          <Box 
                            sx={{ 
                              p: 1, 
                              borderRadius: '50%', 
                              bgcolor: alpha(
                                rule.severity === 'Critical' 
                                  ? theme.palette.error.main 
                                  : theme.palette.warning.main, 
                                0.1
                              ),
                              color: rule.severity === 'Critical' 
                                ? theme.palette.error.main 
                                : theme.palette.warning.main,
                            }}
                          >
                            {rule.severity === 'Critical' ? <ErrorIcon /> : <Warning />}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" fontWeight={500}>{rule.name}</Typography>
                              {!rule.enabled && (
                                <Chip 
                                  label="Disabled" 
                                  size="small" 
                                  sx={{ 
                                    ml: 1, 
                                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                    color: theme.palette.text.secondary,
                                  }} 
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {rule.metric} {rule.condition} {rule.threshold}% for {rule.duration} minutes
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={rule.enabled}
                                onChange={() => {}}
                                color="primary"
                              />
                            }
                            label=""
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 2,
              height: '100%',
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  {selectedRule ? 'Edit Rule' : 'Rule Details'}
                </Typography>
                
                {selectedRule ? (
                  <form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Rule Name"
                          fullWidth
                          value={alertRules.find(r => r.id === selectedRule)?.name || ''}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Metric</InputLabel>
                          <Select
                            value={alertRules.find(r => r.id === selectedRule)?.metric || ''}
                            label="Metric"
                          >
                            <MenuItem value="CPU Usage">CPU Usage</MenuItem>
                            <MenuItem value="Available Memory">Available Memory</MenuItem>
                            <MenuItem value="Error Rate">Error Rate</MenuItem>
                            <MenuItem value="Free Disk Space">Free Disk Space</MenuItem>
                            <MenuItem value="Response Time">Response Time</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Condition</InputLabel>
                          <Select
                            value={alertRules.find(r => r.id === selectedRule)?.condition || ''}
                            label="Condition"
                          >
                            <MenuItem value="above">Above</MenuItem>
                            <MenuItem value="below">Below</MenuItem>
                            <MenuItem value="equal">Equal to</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Threshold"
                          fullWidth
                          value={alertRules.find(r => r.id === selectedRule)?.threshold || ''}
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Duration"
                          fullWidth
                          value={alertRules.find(r => r.id === selectedRule)?.duration || ''}
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">min</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Severity</InputLabel>
                          <Select
                            value={alertRules.find(r => r.id === selectedRule)?.severity || ''}
                            label="Severity"
                          >
                            <MenuItem value="Critical">Critical</MenuItem>
                            <MenuItem value="Warning">Warning</MenuItem>
                            <MenuItem value="Info">Info</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Notification Channels</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={alertRules.find(r => r.id === selectedRule)?.notifications.includes('email') || false}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">Email</Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={alertRules.find(r => r.id === selectedRule)?.notifications.includes('sms') || false}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">SMS</Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={alertRules.find(r => r.id === selectedRule)?.notifications.includes('chat') || false}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chat fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">Chat</Typography>
                              </Box>
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                          <Button 
                            startIcon={<Delete />} 
                            color="error"
                          >
                            Delete
                          </Button>
                          <Button 
                            variant="contained" 
                            startIcon={<Edit />}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <Typography color="text.secondary">
                      Select a rule to view or edit details
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Notification Channels */}
      {activeTab === 'channels' && (
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Notification Channels</Typography>
              <Button 
                startIcon={<Add />} 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ borderRadius: '8px' }}
              >
                Add Channel
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {/* Email Notifications */}
              <Grid item xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mr: 1,
                        }}
                      >
                        <Email />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>Email</Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationChannels.find(c => c.type === 'email')?.enabled || false}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Box>
                  
                  <List>
                    {notificationChannels.find(c => c.type === 'email')?.recipients.map((recipient, index) => (
                      <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={recipient} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <TextField
                    placeholder="Add email address"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <Add fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Paper>
              </Grid>
              
              {/* SMS Notifications */}
              <Grid item xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.02)} 100%)`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          mr: 1,
                        }}
                      >
                        <Phone />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>SMS</Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationChannels.find(c => c.type === 'sms')?.enabled || false}
                          color="secondary"
                        />
                      }
                      label=""
                    />
                  </Box>
                  
                  <List>
                    {notificationChannels.find(c => c.type === 'sms')?.recipients.map((recipient, index) => (
                      <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={recipient} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <TextField
                    placeholder="Add phone number"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <Add fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Paper>
              </Grid>
              
              {/* Chat Notifications */}
              <Grid item xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.02)} 100%)`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          mr: 1,
                        }}
                      >
                        <Chat />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>Chat</Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationChannels.find(c => c.type === 'chat')?.enabled || false}
                          color="success"
                        />
                      }
                      label=""
                    />
                  </Box>
                  
                  <List>
                    {notificationChannels.find(c => c.type === 'chat')?.recipients.map((recipient, index) => (
                      <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Chat fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={recipient} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <TextField
                    placeholder="Add channel"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <Add fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AlertSystem; 