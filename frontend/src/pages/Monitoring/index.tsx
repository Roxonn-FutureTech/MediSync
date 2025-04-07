import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Grid,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Healing as HealingIcon,
  Notifications as AlertsIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import SystemHealth from './components/SystemHealth';
import PerformanceMetrics from './components/PerformanceMetrics';
import ErrorTracking from './components/ErrorTracking';
import AlertSystem from './components/AlertSystem';
import LoggingSystem from './components/LoggingSystem';
import DashboardWidgets from './components/DashboardWidgets';

// Tab interfaces
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`monitoring-tabpanel-${index}`}
      aria-labelledby={`monitoring-tab-${index}`}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `monitoring-tab-${index}`,
    'aria-controls': `monitoring-tabpanel-${index}`,
  };
};

const Monitoring: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          py: 2, 
          px: 3, 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              System Monitoring
            </Typography>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Home
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 0.5 }} fontSize="small" />
                Monitoring
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined"
              startIcon={<DateRangeIcon />}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Last 24 Hours
            </Button>
            <Button 
              variant="outlined"
              startIcon={<RefreshIcon />}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
            <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="monitoring tabs"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 'auto',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              iconPosition="start" 
              label="Dashboard" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<HealingIcon />} 
              iconPosition="start" 
              label="System Health" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<AssessmentIcon />} 
              iconPosition="start" 
              label="Performance" 
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<AlertsIcon />} 
              iconPosition="start" 
              label="Alerts" 
              {...a11yProps(3)} 
            />
            <Tab 
              icon={<ErrorIcon />} 
              iconPosition="start" 
              label="Errors" 
              {...a11yProps(4)} 
            />
            <Tab 
              icon={<StorageIcon />} 
              iconPosition="start" 
              label="Logs" 
              {...a11yProps(5)} 
            />
          </Tabs>
        </Box>
      </Paper>

      {/* Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              System Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor key performance indicators and system status at a glance.
            </Typography>
          </Box>
          <DashboardWidgets />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              System Health Status
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View detailed health status of all system components and services.
            </Typography>
          </Box>
          <SystemHealth />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Performance Metrics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Detailed performance metrics and resource utilization data.
            </Typography>
          </Box>
          <PerformanceMetrics />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Alert Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure and monitor system alerts and notifications.
            </Typography>
          </Box>
          <AlertSystem />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Error Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and analyze application errors and exceptions.
            </Typography>
          </Box>
          <ErrorTracking />
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Logging System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access and search system logs across all services.
            </Typography>
          </Box>
          <LoggingSystem />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default Monitoring; 