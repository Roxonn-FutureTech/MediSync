import React, { useState } from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery, Button, ButtonGroup, alpha } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

import ModernStatCard from '../components/common/ModernStatCard';
import GlassMorphicCard from '../components/common/GlassMorphicCard';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimplePieChart from '../components/charts/SimplePieChart';

// Sample chart data
const responseTimeData = [
  { name: '8AM', value: 5.2 },
  { name: '9AM', value: 4.8 },
  { name: '10AM', value: 5.1 },
  { name: '11AM', value: 4.5 },
  { name: '12PM', value: 6.2 },
  { name: '1PM', value: 5.8 },
  { name: '2PM', value: 4.9 },
  { name: '3PM', value: 4.6 },
];

const emergencyDistributionData = [
  { name: 'Cardiac', value: 35 },
  { name: 'Trauma', value: 28 },
  { name: 'Respiratory', value: 20 },
  { name: 'Neurological', value: 12 },
  { name: 'Other', value: 5 },
];

const teamAvailabilityData = [
  { name: 'Team A', value: 100 },
  { name: 'Team B', value: 80 },
  { name: 'Team C', value: 60 },
  { name: 'Team D', value: 85 },
  { name: 'Team E', value: 90 },
  { name: 'Team F', value: 75 },
];

const EmergencyDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 2
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.9rem' },
            mb: { xs: 1, sm: 0 }
          }}
        >
          Emergency Response Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup size={isMobile ? "small" : "medium"} aria-label="time range filter">
            <Button 
              variant={timeRange === '24h' ? 'contained' : 'outlined'} 
              onClick={() => setTimeRange('24h')}
            >
              24h
            </Button>
            <Button 
              variant={timeRange === '7d' ? 'contained' : 'outlined'} 
              onClick={() => setTimeRange('7d')}
            >
              7d
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'contained' : 'outlined'} 
              onClick={() => setTimeRange('30d')}
            >
              30d
            </Button>
          </ButtonGroup>
          <Button 
            startIcon={<RefreshIcon />} 
            sx={{ ml: 1 }}
            size={isMobile ? "small" : "medium"}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stat Cards Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={6} md={3}>
          <ModernStatCard
            title="Active Emergencies"
            value="12"
            icon={<AlarmIcon />}
            trend={-8}
            subtitle="Critical situations"
            color="#d32f2f"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Currently active emergency situations"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <ModernStatCard
            title="Available Teams"
            value="8"
            icon={<DirectionsRunIcon />}
            trend={2}
            subtitle="Ready to respond"
            color="#00796b"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Teams available for dispatch"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <ModernStatCard
            title="Avg. Response Time"
            value="4.5m"
            icon={<SpeedIcon />}
            trend={12}
            subtitle="From alert to arrival"
            color="#ff8f00"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Average time from alert to team arrival"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <ModernStatCard
            title="Success Rate"
            value="94%"
            icon={<CheckCircleIcon />}
            trend={5}
            subtitle="Positive outcomes"
            color="#2e7d32"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Percentage of successful emergency responses"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2}>
        {/* Response Time Trends */}
        <Grid item xs={12} md={8} sx={{ mb: 2 }}>
          <GlassMorphicCard
            title="Response Time Trends"
            subtitle="Average response times throughout the day"
            icon={<TimerIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size="large"
            fluid
          >
            <Box sx={{ height: { xs: 270, sm: 300, md: 330 }, mt: 1 }}>
              <SimpleAreaChart data={responseTimeData} color={theme.palette.info.main} />
            </Box>
          </GlassMorphicCard>
        </Grid>

        {/* Emergency Distribution */}
        <Grid item xs={12} md={4} sx={{ mb: 2 }}>
          <GlassMorphicCard
            title="Emergency Distribution"
            subtitle="Types of emergencies responded to"
            icon={<LocalHospitalIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size="large"
            fluid
          >
            <Box sx={{ height: { xs: 270, sm: 300, md: 330 }, mt: 1 }}>
              <SimplePieChart data={emergencyDistributionData} />
            </Box>
          </GlassMorphicCard>
        </Grid>

        {/* Active Incidents */}
        <Grid item xs={12} md={8} sx={{ mb: 2 }}>
          <GlassMorphicCard
            title="Active Incidents Map"
            subtitle="Geographical distribution of current emergencies"
            icon={<AlarmIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size="large"
            fluid
          >
            <Box sx={{ 
              height: { xs: 330, md: 350 }, 
              mt: 1, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}>
              <Typography variant="h6" color="text.secondary">
                Map Component Would Render Here
              </Typography>
            </Box>
          </GlassMorphicCard>
        </Grid>

        {/* Team Availability */}
        <Grid item xs={12} md={4} sx={{ mb: 2 }}>
          <GlassMorphicCard
            title="Team Availability"
            subtitle="Response teams readiness status"
            icon={<PersonIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size="large"
            fluid
          >
            <Box sx={{ height: { xs: 330, md: 350 }, mt: 1 }}>
              <SimpleBarChart 
                data={teamAvailabilityData} 
                color={theme.palette.success.main} 
                showGrid={true}
                showAxis={true}
              />
            </Box>
          </GlassMorphicCard>
        </Grid>

        {/* Current Status */}
        <Grid item xs={12}>
          <GlassMorphicCard
            title="System Status Monitor"
            subtitle="Real-time emergency response system status"
            icon={<AutorenewIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            fluid
          >
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6} sm={3}>
                <ModernStatCard
                  title="Dispatchers"
                  value="12/12"
                  color="success"
                  variant="glass"
                  size="small"
                  fluid
                  status="success"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <ModernStatCard
                  title="Ambulances"
                  value="18/24"
                  color="success"
                  variant="glass"
                  size="small"
                  fluid
                  status="success"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <ModernStatCard
                  title="Response Teams"
                  value="8/10"
                  color="warning"
                  variant="glass"
                  size="small"
                  fluid
                  status="warning"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <ModernStatCard
                  title="Comm System"
                  value="Online"
                  color="success"
                  variant="glass"
                  size="small"
                  fluid
                  status="success"
                />
              </Grid>
            </Grid>
          </GlassMorphicCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyDashboard; 