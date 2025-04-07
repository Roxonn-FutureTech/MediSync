import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Circle as CircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Autorenew as AutorenewIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Mock activity data
const activityItems = [
  {
    id: 'act1',
    type: 'error',
    message: 'Database connection timeout',
    timestamp: '2 minutes ago',
    source: 'Database Service',
    user: 'System',
    details: 'Connection to primary database timed out after 30s. Failover initiated.',
  },
  {
    id: 'act2',
    type: 'warning',
    message: 'High CPU usage detected',
    timestamp: '15 minutes ago',
    source: 'Monitoring Agent',
    user: 'System',
    details: 'Server web-02 CPU usage at 92% for over 5 minutes.',
  },
  {
    id: 'act3',
    type: 'info',
    message: 'Backup completed successfully',
    timestamp: '1 hour ago',
    source: 'Backup Service',
    user: 'System',
    details: 'Daily database backup completed. Size: 2.3GB, Duration: 8 minutes.',
  },
  {
    id: 'act4',
    type: 'success',
    message: 'Server auto-scaling triggered',
    timestamp: '1 hour ago',
    source: 'Auto-scale Manager',
    user: 'System',
    details: 'Added 2 new application servers to handle increased load.',
  },
  {
    id: 'act5',
    type: 'info',
    message: 'Configuration updated',
    timestamp: '3 hours ago',
    source: 'Config Service',
    user: 'admin@medisync.com',
    details: 'API rate limits updated from 100 to 200 requests per minute.',
  },
  {
    id: 'act6',
    type: 'warning',
    message: 'Slow database query detected',
    timestamp: '4 hours ago',
    source: 'Performance Monitor',
    user: 'System',
    details: 'Query execution time: 8.2s. Query: SELECT * FROM medical_records WHERE...',
  },
  {
    id: 'act7',
    type: 'error',
    message: 'API authentication failures',
    timestamp: '5 hours ago',
    source: 'Security Service',
    user: 'System',
    details: 'Multiple authentication failures from IP 203.0.113.45. Access temporarily blocked.',
  },
  {
    id: 'act8',
    type: 'success',
    message: 'Service deployment completed',
    timestamp: '12 hours ago',
    source: 'Deployment Pipeline',
    user: 'devops@medisync.com',
    details: 'Version 2.5.0 of Patient API deployed to production successfully.',
  },
];

interface ActivityItemProps {
  item: typeof activityItems[0];
  expanded: boolean;
  onToggle: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item, expanded, onToggle }) => {
  const theme = useTheme();

  const getTypeIcon = () => {
    switch (item.type) {
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        },
        ...(expanded && {
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
          borderColor: alpha(getTypeColor(), 0.3),
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar
          sx={{
            bgcolor: alpha(getTypeColor(), 0.12),
            color: getTypeColor(),
            width: 40,
            height: 40,
          }}
        >
          {getTypeIcon()}
        </Avatar>

        <Box sx={{ ml: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.message}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {item.source} • {item.timestamp}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={onToggle}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {expanded && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Details:</strong> {item.details}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>User:</strong> {item.user}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color={item.type === 'error' || item.type === 'warning' ? 'warning' : 'primary'}
                  sx={{ borderRadius: 2, mr: 1 }}
                >
                  Investigate
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color={item.type === 'error' ? 'error' : 'primary'}
                  sx={{ borderRadius: 2 }}
                >
                  {item.type === 'error' ? 'Resolve Issue' : 'Acknowledge'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const ActivityStream: React.FC = () => {
  const theme = useTheme();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, flex: '0 0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Activity Stream
            </Typography>
            <Badge
              color="error"
              badgeContent={3}
              sx={{ ml: 1.5 }}
            >
              <Chip
                label="Live"
                size="small"
                icon={<CircleIcon sx={{ width: 8, height: 8 }} />}
                sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  '.MuiChip-icon': { 
                    color: theme.palette.success.main,
                    ml: 1.5,
                  },
                  fontWeight: 600,
                }}
              />
            </Badge>
          </Box>
          <Box>
            <Tooltip title="Filter activities">
              <IconButton size="small" sx={{ mr: 1 }}>
                <FilterIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
      
      <Divider />
      
      <Box sx={{ p: 3, flex: '1 1 auto', overflow: 'auto' }}>
        {activityItems.map((item) => (
          <ActivityItem
            key={item.id}
            item={item}
            expanded={expandedItem === item.id}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          startIcon={<AutorenewIcon />}
          sx={{ borderRadius: 2 }}
        >
          Load More Activities
        </Button>
      </Box>
    </Card>
  );
};

export default ActivityStream; 