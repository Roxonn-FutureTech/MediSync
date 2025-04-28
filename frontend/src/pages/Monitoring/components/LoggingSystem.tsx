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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  ButtonGroup,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  FileDownload,
  Error as ErrorIcon,
  Warning,
  Info,
  AccessTime,
  Code,
  Storage,
  ErrorOutline,
  CheckCircle,
  Description,
  FolderOpen,
  CloudDownload,
  Settings,
  Delete,
} from '@mui/icons-material';

// Mock log data
const logEntries = [
  {
    id: 'LOG001',
    timestamp: '2025-04-07 11:23:48.125',
    level: 'ERROR',
    source: 'PatientController',
    message: 'NullPointerException while processing patient data',
    details: 'java.lang.NullPointerException: Cannot invoke "com.medisync.models.Patient.getId()" because "patient" is null at com.medisync.controllers.PatientController.processData(PatientController.java:156)',
  },
  {
    id: 'LOG002',
    timestamp: '2025-04-07 11:23:45.932',
    level: 'WARN',
    source: 'DatabaseService',
    message: 'Slow database query detected (1245ms)',
    details: 'Query: SELECT * FROM patients WHERE last_visit > ? AND status = ? [params: 2025-01-01, ACTIVE]',
  },
  {
    id: 'LOG003',
    timestamp: '2025-04-07 11:23:42.546',
    level: 'INFO',
    source: 'AuthService',
    message: 'User admin logged in successfully',
    details: 'IP: 192.168.1.105, Browser: Chrome 98.0.4758.102',
  },
  {
    id: 'LOG004',
    timestamp: '2025-04-07 11:23:38.781',
    level: 'INFO',
    source: 'AppointmentService',
    message: 'Appointment scheduled for patient ID 12345',
    details: 'Appointment details: Doctor: Dr. Smith, Department: Cardiology, Date: 2025-04-15 10:30 AM',
  },
  {
    id: 'LOG005',
    timestamp: '2025-04-07 11:23:32.129',
    level: 'ERROR',
    source: 'API Gateway',
    message: 'Failed to connect to payment service',
    details: 'Connection timeout after 5000ms. Service: https://api.payment.medisync.com/v1/transactions',
  },
  {
    id: 'LOG006',
    timestamp: '2025-04-07 11:23:28.967',
    level: 'WARN',
    source: 'SecurityService',
    message: 'Multiple failed login attempts detected',
    details: 'Username: john.doe, IP: 203.0.113.45, Attempts: 5',
  },
  {
    id: 'LOG007',
    timestamp: '2025-04-07 11:23:24.553',
    level: 'INFO',
    source: 'System',
    message: 'Scheduled database backup completed',
    details: 'Backup size: 2.3 GB, Duration: 45s, Location: /backups/db_20250407.bak',
  },
  {
    id: 'LOG008',
    timestamp: '2025-04-07 11:23:18.322',
    level: 'DEBUG',
    source: 'PatientSearch',
    message: 'Patient search parameters processed',
    details: 'Search criteria: name=Smith, age=45-65, condition=diabetes',
  },
];

// Available log files
const logFiles = [
  { name: 'application.log', size: '4.5 MB', updated: '2025-04-07 11:30:00' },
  { name: 'error.log', size: '1.2 MB', updated: '2025-04-07 11:30:00' },
  { name: 'access.log', size: '8.7 MB', updated: '2025-04-07 11:30:00' },
  { name: 'security.log', size: '0.8 MB', updated: '2025-04-07 11:30:00' },
  { name: 'application-2025-04-06.log', size: '12.3 MB', updated: '2025-04-06 23:59:59' },
  { name: 'error-2025-04-06.log', size: '3.1 MB', updated: '2025-04-06 23:59:59' },
];

const LoggingSystem: React.FC = () => {
  const theme = useTheme();
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logLevel, setLogLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'live' | 'files'>('live');
  const [selectedFile, setSelectedFile] = useState<string | null>('application.log');
  
  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return theme.palette.error.main;
      case 'WARN':
        return theme.palette.warning.main;
      case 'INFO':
        return theme.palette.info.main;
      case 'DEBUG':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <ErrorIcon fontSize="small" />;
      case 'WARN':
        return <Warning fontSize="small" />;
      case 'INFO':
        return <Info fontSize="small" />;
      case 'DEBUG':
        return <CheckCircle fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ButtonGroup variant="outlined" size="small">
            <Button 
              variant={activeView === 'live' ? 'contained' : 'outlined'} 
              onClick={() => setActiveView('live')}
            >
              Live Logs
            </Button>
            <Button 
              variant={activeView === 'files' ? 'contained' : 'outlined'} 
              onClick={() => setActiveView('files')}
            >
              Log Files
            </Button>
          </ButtonGroup>

          {activeView === 'live' && (
            <>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="warn">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="debug">Debug</MenuItem>
                </Select>
              </FormControl>

              <TextField
                placeholder="Search logs..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                sx={{ width: { xs: '100%', sm: 200 } }}
              />
            </>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            size="small"
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownload />}
            size="small"
          >
            Export
          </Button>
        </Box>
      </Box>

      {activeView === 'live' ? (
        <Grid container spacing={3}>
          {/* Log List */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      System Logs
                    </Typography>
                  </Box>
                  <Chip 
                    label="Last updated: Just now" 
                    size="small" 
                    icon={<AccessTime fontSize="small" />}
                    sx={{ 
                      borderRadius: '8px', 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }} 
                  />
                </Box>
                
                <Divider />

                <Box sx={{ height: 500, overflow: 'auto' }}>
                  {logEntries.map((log) => (
                    <Paper
                      key={log.id}
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        mx: 2,
                        mt: 1,
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderLeft: `4px solid ${getLevelColor(log.level)}`,
                        backgroundColor: alpha(getLevelColor(log.level), 0.05),
                        ...(selectedLog === log.id && {
                          boxShadow: `0 2px 8px ${alpha(getLevelColor(log.level), 0.2)}`,
                        }),
                      }}
                      onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 0.5, 
                              borderRadius: 1,
                              bgcolor: alpha(getLevelColor(log.level), 0.1),
                              color: getLevelColor(log.level),
                              mr: 1,
                            }}
                          >
                            {getLevelIcon(log.level)}
                          </Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {log.source}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {log.timestamp}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {log.message}
                      </Typography>
                      
                      {selectedLog === log.id && (
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1, 
                            bgcolor: alpha(theme.palette.common.black, 0.03),
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            mt: 1,
                            position: 'relative',
                          }}
                        >
                          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Copy">
                              <IconButton size="small">
                                <Code fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          {log.details}
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* Log Files */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 2,
              height: '100%',
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FolderOpen sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Log Files
                  </Typography>
                </Box>
                
                <TextField
                  placeholder="Search files..."
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }}
                  sx={{ mb: 2 }}
                />
                
                <List>
                  {logFiles.map((file) => (
                    <ListItem
                      key={file.name}
                      button
                      onClick={() => setSelectedFile(file.name)}
                      selected={selectedFile === file.name}
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Description 
                          color={file.name.includes('error') ? 'error' : 'primary'} 
                          fontSize="small" 
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.name} 
                        secondary={`${file.size} • ${file.updated}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 2,
              height: '100%',
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {selectedFile || 'File Preview'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      startIcon={<CloudDownload />} 
                      size="small" 
                      variant="outlined"
                    >
                      Download
                    </Button>
                    <Button 
                      startIcon={<Delete />} 
                      size="small" 
                      color="error"
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {selectedFile ? (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.common.black, 0.03),
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      height: 400,
                      overflow: 'auto',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <TextField
                        size="small"
                        placeholder="Search in file"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px', bgcolor: 'background.paper' }
                        }}
                      />
                    </Box>
                    
                    {/* File content preview - would be actual log content in a real app */}
                    <Box sx={{ mt: 5, color: 'text.secondary' }}>
                      {Array(20).fill(0).map((_, i) => (
                        <Box key={i} sx={{ mb: 1, display: 'flex' }}>
                          <Box sx={{ width: 40, color: alpha(theme.palette.text.secondary, 0.5), mr: 2 }}>
                            {i + 1}
                          </Box>
                          <Box>
                            {i % 4 === 0 && (
                              <Box component="span" sx={{ color: theme.palette.error.main }}>
                                [ERROR] 2025-04-07 11:23:48.125 [http-nio-8080-exec-2] PatientController - NullPointerException while processing patient data
                              </Box>
                            )}
                            {i % 4 === 1 && (
                              <Box component="span" sx={{ color: theme.palette.warning.main }}>
                                [WARN] 2025-04-07 11:23:45.932 [http-nio-8080-exec-1] DatabaseService - Slow database query detected (1245ms)
                              </Box>
                            )}
                            {i % 4 === 2 && (
                              <Box component="span" sx={{ color: theme.palette.info.main }}>
                                [INFO] 2025-04-07 11:23:42.546 [http-nio-8080-exec-3] AuthService - User admin logged in successfully
                              </Box>
                            )}
                            {i % 4 === 3 && (
                              <Box component="span" sx={{ color: theme.palette.success.main }}>
                                [DEBUG] 2025-04-07 11:23:18.322 [http-nio-8080-exec-4] PatientSearch - Patient search parameters processed
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 400,
                    color: 'text.secondary'
                  }}>
                    <Typography>Select a log file to view</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default LoggingSystem; 