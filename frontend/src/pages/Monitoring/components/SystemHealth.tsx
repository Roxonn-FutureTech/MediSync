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
  Tooltip,
  Button,
  LinearProgress,
  Paper,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Healing,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Refresh,
  ExpandMore,
  ExpandLess,
  Storage,
  Memory,
  NetworkCheck,
  Dns,
  CloudQueue,
  Api,
  StorageRounded,
  Security,
  NotificationsActive,
  Settings,
} from '@mui/icons-material';

// Health status component
const HealthStatus: React.FC<{ 
  status: 'up' | 'down' | 'warning' | 'maintenance'; 
  label: string;
  details?: string;
  uptime?: string;
}> = ({ status, label, details, uptime }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = () => {
    switch (status) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'maintenance':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'up':
        return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'down':
        return <Cancel sx={{ fontSize: 20 }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 20 }} />;
      case 'maintenance':
        return <Info sx={{ fontSize: 20 }} />;
      default:
        return <Info sx={{ fontSize: 20 }} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'up':
        return 'Operational';
      case 'down':
        return 'Down';
      case 'warning':
        return 'Degraded';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        borderLeft: `4px solid ${getStatusColor()}`,
        boxShadow: `0 4px 12px ${alpha(getStatusColor(), 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 1,
                borderRadius: '50%',
                backgroundColor: alpha(getStatusColor(), 0.1),
                color: getStatusColor(),
                mr: 2,
              }}
            >
              {getStatusIcon()}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(),
                    mr: 1,
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {getStatusText()}
                  {uptime && ` • Uptime: ${uptime}`}
                </Typography>
              </Box>
            </Box>
          </Box>
          {details && (
            <IconButton 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                transition: '0.3s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          )}
        </Box>
        
        {details && (
          <Collapse in={expanded}>
            <Box sx={{ mt: 2, ml: 6 }}>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                {details}
              </Typography>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

// Health check table row
const HealthCheckRow: React.FC<{
  name: string;
  status: 'pass' | 'fail' | 'warn';
  responseTime: number;
  lastChecked: string;
  icon: React.ReactNode;
}> = ({ name, status, responseTime, lastChecked, icon }) => {
  const theme = useTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return theme.palette.success.main;
      case 'fail':
        return theme.palette.error.main;
      case 'warn':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pass':
        return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
      case 'fail':
        return <Cancel fontSize="small" sx={{ color: theme.palette.error.main }} />;
      case 'warn':
        return <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />;
      default:
        return null;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            mr: 2,
            color: theme.palette.primary.main,
          }}>
            {icon}
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getStatusIcon()}
          <Typography variant="body2" sx={{ ml: 1, color: getStatusColor(), fontWeight: 500 }}>
            {status === 'pass' ? 'Healthy' : status === 'fail' ? 'Failed' : 'Warning'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 50, mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(responseTime / 10, 100)} 
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: responseTime < 200 
                    ? theme.palette.success.main 
                    : responseTime < 500 
                      ? theme.palette.warning.main 
                      : theme.palette.error.main,
                }
              }}
            />
          </Box>
          <Typography variant="body2">
            {responseTime} ms
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {lastChecked}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const SystemHealth: React.FC = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>('services');
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Mock data
  const services = [
    { 
      name: 'API Gateway', 
      status: 'up' as const, 
      uptime: '99.98%', 
      details: 'All API endpoints are responding normally. Last restart: 45 days ago.'
    },
    { 
      name: 'Authentication Service', 
      status: 'up' as const, 
      uptime: '99.99%',
      details: 'Authentication and authorization services are operating normally.'
    },
    { 
      name: 'Patient Records Service', 
      status: 'warning' as const, 
      uptime: '98.75%',
      details: 'Service is operational but experiencing intermittent slowdowns when handling large data requests. The team is investigating the issue.'
    },
    { 
      name: 'Notification Service', 
      status: 'down' as const, 
      details: 'Service is currently down due to database connectivity issues. Engineering team has been notified and is working on a fix. Estimated recovery time: 30 minutes.'
    },
    { 
      name: 'Billing System', 
      status: 'maintenance' as const, 
      details: 'Scheduled maintenance in progress. Service will be restored by 18:00 UTC.'
    },
  ];

  const infrastructureStatus = [
    { name: 'Primary Database', status: 'up' as const, uptime: '99.999%' },
    { name: 'Database Replica', status: 'up' as const, uptime: '99.992%' },
    { name: 'Application Servers', status: 'up' as const, uptime: '99.95%' },
    { name: 'Cache Servers', status: 'up' as const, uptime: '99.98%' },
    { name: 'Load Balancers', status: 'up' as const, uptime: '100%' },
  ];

  const healthChecks = [
    { 
      name: 'API Health Check', 
      status: 'pass' as const, 
      responseTime: 187, 
      lastChecked: '2 min ago',
      icon: <Api fontSize="small" />,
    },
    { 
      name: 'Database Connectivity', 
      status: 'pass' as const, 
      responseTime: 95, 
      lastChecked: '3 min ago',
      icon: <StorageRounded fontSize="small" />,
    },
    { 
      name: 'Cache Response', 
      status: 'pass' as const, 
      responseTime: 42, 
      lastChecked: '2 min ago',
      icon: <Memory fontSize="small" />,
    },
    { 
      name: 'Authentication Service', 
      status: 'pass' as const, 
      responseTime: 156, 
      lastChecked: '4 min ago',
      icon: <Security fontSize="small" />,
    },
    { 
      name: 'Notification Service', 
      status: 'fail' as const, 
      responseTime: 2456, 
      lastChecked: '1 min ago',
      icon: <NotificationsActive fontSize="small" />,
    },
    { 
      name: 'Patient Records API', 
      status: 'warn' as const, 
      responseTime: 578, 
      lastChecked: '3 min ago',
      icon: <Settings fontSize="small" />,
    },
  ];

  return (
    <Box sx={{ height: '100%' }}>
      {/* System Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 2,
            height: '100%',
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Healing sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    System Status
                  </Typography>
                </Box>
                <Tooltip title="Refresh status">
                  <IconButton size="small">
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckCircle />} 
                  label="25 Operational" 
                  color="success"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
                <Chip 
                  icon={<Warning />} 
                  label="2 Degraded" 
                  color="warning"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
                <Chip 
                  icon={<Cancel />} 
                  label="1 Outage" 
                  color="error"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
                <Chip 
                  icon={<Info />} 
                  label="1 Maintenance" 
                  color="info"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
              </Box>
              
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    mb: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleSection('services')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CloudQueue sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={500}>Services</Typography>
                  </Box>
                  <IconButton size="small">
                    {expandedSection === 'services' ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                
                <Collapse in={expandedSection === 'services'}>
                  <Box sx={{ pl: 1, pr: 1 }}>
                    {services.map((service, index) => (
                      <HealthStatus 
                        key={index} 
                        status={service.status}
                        label={service.name}
                        details={service.details}
                        uptime={service.uptime}
                      />
                    ))}
                  </Box>
                </Collapse>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    mb: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleSection('infrastructure')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Dns sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={500}>Infrastructure</Typography>
                  </Box>
                  <IconButton size="small">
                    {expandedSection === 'infrastructure' ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                
                <Collapse in={expandedSection === 'infrastructure'}>
                  <Box sx={{ pl: 1, pr: 1 }}>
                    {infrastructureStatus.map((item, index) => (
                      <HealthStatus 
                        key={index} 
                        status={item.status}
                        label={item.name}
                        uptime={item.uptime}
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            height: '100%',
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Resource Status
                </Typography>
              </Box>
              
              {/* Memory */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Memory fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                    <Typography variant="body2">Memory</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>67% (16.1 GB)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={67} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              
              {/* CPU */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Dns fontSize="small" sx={{ mr: 0.5, color: theme.palette.secondary.main }} />
                    <Typography variant="body2">CPU</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>42% (8 Cores)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={42} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.secondary.main,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              
              {/* Disk */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Storage fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                    <Typography variant="body2">Disk</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>78% (1.2 TB)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={78} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.success.main,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              
              {/* Network */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NetworkCheck fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                    <Typography variant="body2">Network</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>35% (350 Mbps)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={35} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.warning.main,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Health Checks */}
      <Card sx={{ 
        borderRadius: 2,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Healing sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Health Checks
              </Typography>
            </Box>
            <Box>
              <Button 
                size="small" 
                startIcon={<Refresh />}
                sx={{ mr: 1 }}
              >
                Run All Checks
              </Button>
              <Chip 
                label="Last check: 2 min ago" 
                size="small" 
                sx={{ 
                  borderRadius: '8px', 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }} 
              />
            </Box>
          </Box>
          
          <Divider />
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Check Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Last Checked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {healthChecks.map((check, index) => (
                  <HealthCheckRow 
                    key={index}
                    name={check.name}
                    status={check.status}
                    responseTime={check.responseTime}
                    lastChecked={check.lastChecked}
                    icon={check.icon}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemHealth; 