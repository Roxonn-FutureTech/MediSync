import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Grid,
  Avatar,
  IconButton,
  Divider,
  LinearProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  CloudQueue as CloudIcon,
  NetworkCheck as NetworkIcon,
  Healing as HealingIcon,
  NotificationsActive as AlertIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';

interface WidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  progress?: number;
}

export const StatWidget: React.FC<WidgetProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendValue,
  subtitle,
  progress,
}) => {
  const theme = useTheme();
  const bgColor = color || theme.palette.primary.main;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
      case 'down':
        return <TrendingDownIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
      default:
        return <SwapVertIcon fontSize="small" sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        height: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(bgColor, 0.15)} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(bgColor, 0.12),
              color: bgColor,
              width: 48,
              height: 48,
              borderRadius: 2,
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small">
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {value}
        </Typography>

        {subtitle && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        )}

        {trend && trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {getTrendIcon()}
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ ml: 0.5, color: getTrendColor() }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(bgColor, 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: bgColor,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const StatusWidget: React.FC<{
  title: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  details: string;
  lastChecked: string;
}> = ({ title, status, details, lastChecked }) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'critical':
        return theme.palette.error.main;
      case 'maintenance':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'critical':
        return <ErrorIcon />;
      case 'maintenance':
        return <CloudIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        height: '100%',
        borderLeft: `5px solid ${getStatusColor()}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            size="small"
            sx={{
              bgcolor: alpha(getStatusColor(), 0.1),
              color: getStatusColor(),
              fontWeight: 600,
              borderRadius: 2,
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {details}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Last checked
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            {lastChecked}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const MetricsWidget: React.FC<{
  title: string;
  metrics: Array<{
    name: string;
    value: number;
    unit: string;
    color?: string;
  }>;
}> = ({ title, metrics }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {metrics.map((metric, index) => (
            <Box key={index} sx={{ mb: index !== metrics.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {metric.name}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {metric.value} {metric.unit}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(metric.color || theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: metric.color || theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardWidgets: React.FC = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget
          title="Server Uptime"
          value="99.98%"
          icon={<CheckIcon />}
          color={theme.palette.success.main}
          trend="up"
          trendValue="+0.3% from last month"
          progress={99.98}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget
          title="Response Time"
          value="128ms"
          icon={<SpeedIcon />}
          color={theme.palette.primary.main}
          trend="down"
          trendValue="-12ms improvement"
          progress={75}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget
          title="Active Alerts"
          value="7"
          icon={<AlertIcon />}
          color={theme.palette.warning.main}
          trend="up"
          trendValue="+2 since yesterday"
          progress={35}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatWidget
          title="Error Rate"
          value="0.12%"
          icon={<ErrorIcon />}
          color={theme.palette.error.main}
          trend="down"
          trendValue="-0.08% improvement"
          progress={10}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StatusWidget
          title="API Gateway"
          status="healthy"
          details="All API endpoints are responding normally with an average response time of 128ms. No errors detected in the last 24 hours."
          lastChecked="2 minutes ago"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusWidget
          title="Database Cluster"
          status="warning"
          details="The primary database is experiencing higher than normal load. The replication lag is increasing. Auto-scaling has been triggered."
          lastChecked="1 minute ago"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <MetricsWidget 
          title="System Resources"
          metrics={[
            { name: 'CPU Usage', value: 42, unit: '%', color: theme.palette.primary.main },
            { name: 'Memory', value: 67, unit: '%', color: theme.palette.secondary.main },
            { name: 'Disk Space', value: 78, unit: '%', color: theme.palette.success.main },
            { name: 'Network', value: 35, unit: '%', color: theme.palette.warning.main },
          ]}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MetricsWidget 
          title="Application Performance"
          metrics={[
            { name: 'Throughput', value: 82, unit: 'req/s', color: theme.palette.info.main },
            { name: 'Error Rate', value: 2.4, unit: '%', color: theme.palette.error.main },
            { name: 'Cache Hit Ratio', value: 91, unit: '%', color: theme.palette.success.main },
            { name: 'Avg. Response Time', value: 65, unit: 'ms', color: theme.palette.warning.main },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardWidgets; 