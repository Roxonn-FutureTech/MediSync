import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Badge,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Circle as CircleIcon,
  Storage as StorageIcon,
  MoreVert as MoreVertIcon,
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Dns as DnsIcon,
  Speed as SpeedIcon,
  CloudSync as CloudSyncIcon,
  CloudOff as CloudOffIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Mock server data
const servers = [
  {
    id: 'srv-01',
    name: 'app-server-01',
    role: 'Application Server',
    status: 'online',
    uptime: '42d 14h 27m',
    ip: '10.0.1.101',
    region: 'us-east',
    metrics: {
      cpu: 38,
      memory: 64,
      disk: 42,
      network: 28,
    },
    issues: 0,
  },
  {
    id: 'srv-02',
    name: 'app-server-02',
    role: 'Application Server',
    status: 'online',
    uptime: '15d 22h 18m',
    ip: '10.0.1.102',
    region: 'us-east',
    metrics: {
      cpu: 72,
      memory: 81,
      disk: 51,
      network: 45,
    },
    issues: 1,
  },
  {
    id: 'srv-03',
    name: 'db-server-01',
    role: 'Database (Primary)',
    status: 'online',
    uptime: '87d 10h 42m',
    ip: '10.0.1.201',
    region: 'us-east',
    metrics: {
      cpu: 62,
      memory: 78,
      disk: 87,
      network: 32,
    },
    issues: 2,
  },
  {
    id: 'srv-04',
    name: 'db-server-02',
    role: 'Database (Replica)',
    status: 'online',
    uptime: '87d 10h 42m',
    ip: '10.0.1.202',
    region: 'us-west',
    metrics: {
      cpu: 27,
      memory: 58,
      disk: 75,
      network: 18,
    },
    issues: 0,
  },
  {
    id: 'srv-05',
    name: 'cache-server-01',
    role: 'Cache Server',
    status: 'online',
    uptime: '23d 7h 15m',
    ip: '10.0.1.151',
    region: 'us-east',
    metrics: {
      cpu: 41,
      memory: 86,
      disk: 22,
      network: 56,
    },
    issues: 0,
  },
  {
    id: 'srv-06',
    name: 'load-balancer-01',
    role: 'Load Balancer',
    status: 'online',
    uptime: '94d 2h 51m',
    ip: '10.0.1.51',
    region: 'us-east',
    metrics: {
      cpu: 28,
      memory: 45,
      disk: 32,
      network: 72,
    },
    issues: 0,
  },
  {
    id: 'srv-07',
    name: 'log-server-01',
    role: 'Log Aggregator',
    status: 'warning',
    uptime: '18d 9h 46m',
    ip: '10.0.1.171',
    region: 'us-east',
    metrics: {
      cpu: 51,
      memory: 92,
      disk: 94,
      network: 48,
    },
    issues: 1,
  },
  {
    id: 'srv-08',
    name: 'backup-server-01',
    role: 'Backup Server',
    status: 'offline',
    uptime: '0d 0h 37m',
    ip: '10.0.1.181',
    region: 'us-west',
    metrics: {
      cpu: 0,
      memory: 0,
      disk: 78,
      network: 0,
    },
    issues: 3,
  },
];

interface ServerCardProps {
  server: typeof servers[0];
}

const ServerCard: React.FC<ServerCardProps> = ({ server }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (server.status) {
      case 'online':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'offline':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getMetricColor = (value: number) => {
    if (value > 90) return theme.palette.error.main;
    if (value > 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getServerIcon = () => {
    if (server.role.includes('Database')) return <StorageIcon />;
    if (server.role.includes('Load Balancer')) return <DnsIcon />;
    if (server.role.includes('Cache')) return <MemoryIcon />;
    return <ComputerIcon />;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        '&:hover': {
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        },
      }}
    >
      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 4,
          backgroundColor: getStatusColor(),
        }}
      />
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 42,
                height: 42,
                mr: 2,
              }}
            >
              {getServerIcon()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {server.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Badge
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: getStatusColor(),
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {server.role}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            {server.issues > 0 && (
              <Tooltip title={`${server.issues} issues detected`}>
                <Chip
                  icon={<WarningIcon fontSize="small" />}
                  label={server.issues}
                  size="small"
                  color="error"
                  sx={{ borderRadius: 1, mr: 1 }}
                />
              </Tooltip>
            )}
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              IP Address
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {server.ip}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Uptime
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {server.uptime}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Resource Usage
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">CPU</Typography>
              <Typography variant="caption" fontWeight={500}>
                {server.metrics.cpu}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={server.metrics.cpu}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: alpha(getMetricColor(server.metrics.cpu), 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  backgroundColor: getMetricColor(server.metrics.cpu),
                },
                mb: 1,
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Memory</Typography>
              <Typography variant="caption" fontWeight={500}>
                {server.metrics.memory}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={server.metrics.memory}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: alpha(getMetricColor(server.metrics.memory), 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  backgroundColor: getMetricColor(server.metrics.memory),
                },
              }}
            />
          </Box>
        </Box>

        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Disk</Typography>
                  <Typography variant="caption" fontWeight={500}>
                    {server.metrics.disk}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={server.metrics.disk}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(getMetricColor(server.metrics.disk), 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      backgroundColor: getMetricColor(server.metrics.disk),
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Network</Typography>
                  <Typography variant="caption" fontWeight={500}>
                    {server.metrics.network}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={server.metrics.network}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(getMetricColor(server.metrics.network), 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      backgroundColor: getMetricColor(server.metrics.network),
                    },
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ borderRadius: 2, mr: 1 }}
              >
                Details
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ borderRadius: 2 }}
                color={server.status === 'offline' ? 'success' : 'primary'}
              >
                {server.status === 'offline' ? 'Restart' : 'Manage'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Paper>
  );
};

// Summary component
const ClusterSummary = () => {
  const theme = useTheme();

  // Count servers by status
  const onlineCount = servers.filter(s => s.status === 'online').length;
  const warningCount = servers.filter(s => s.status === 'warning').length;
  const offlineCount = servers.filter(s => s.status === 'offline').length;
  const totalIssues = servers.reduce((acc, s) => acc + s.issues, 0);

  // Calculate overall health percentage
  const healthPercentage = (onlineCount / servers.length) * 100;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DnsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Cluster Health
            </Typography>
          </Box>
          <Box>
            <IconButton size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'relative', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: `conic-gradient(${theme.palette.success.main} ${healthPercentage}%, ${alpha(theme.palette.divider, 0.1)} 0)`,
                  transform: 'rotate(-90deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={700} sx={{ transform: 'rotate(90deg)' }}>
                  {Math.round(healthPercentage)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ transform: 'rotate(90deg)' }}>
                  Healthy
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CircleIcon sx={{ color: theme.palette.success.main, fontSize: 12, mr: 1 }} />
                    <Typography variant="body2" color={theme.palette.success.main} fontWeight={600}>
                      Online
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {onlineCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servers
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CircleIcon sx={{ color: theme.palette.warning.main, fontSize: 12, mr: 1 }} />
                    <Typography variant="body2" color={theme.palette.warning.main} fontWeight={600}>
                      Warning
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {warningCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servers
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CircleIcon sx={{ color: theme.palette.error.main, fontSize: 12, mr: 1 }} />
                    <Typography variant="body2" color={theme.palette.error.main} fontWeight={600}>
                      Offline
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {offlineCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servers
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon sx={{ color: theme.palette.error.main, fontSize: 12, mr: 1 }} />
                    <Typography variant="body2" color={theme.palette.error.main} fontWeight={600}>
                      Issues
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {totalIssues}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Button
              variant="outlined"
              sx={{ mt: 2, borderRadius: 2, float: 'right' }}
            >
              View Detailed Report
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ClusterStatus: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <ClusterSummary />
      
      <Grid container spacing={3}>
        {servers.map((server) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={server.id}>
            <ServerCard server={server} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClusterStatus; 