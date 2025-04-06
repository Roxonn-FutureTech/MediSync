import React from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import HealthcareIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TimelineIcon from '@mui/icons-material/Timeline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';

import ModernStatCard from '../components/common/ModernStatCard';
import GlassMorphicCard from '../components/common/GlassMorphicCard';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimplePieChart from '../components/charts/SimplePieChart';

// Sample chart data
const areaChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 590 },
  { name: 'Jun', value: 350 },
  { name: 'Jul', value: 470 },
  { name: 'Aug', value: 620 },
];

const barChartData = [
  { name: 'Mon', value: 22 },
  { name: 'Tue', value: 18 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 31 },
  { name: 'Fri', value: 28 },
  { name: 'Sat', value: 15 },
  { name: 'Sun', value: 12 },
];

const pieChartData = [
  { name: 'Cardiology', value: 35 },
  { name: 'Neurology', value: 20 },
  { name: 'Orthopedics', value: 25 },
  { name: 'Pediatrics', value: 15 },
  { name: 'Other', value: 5 },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
          }}
        >
          Healthcare Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Welcome back! Here's an overview of your medical practice.
        </Typography>
      </Box>

      {/* Key Stats - First Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ModernStatCard
            title="Total Patients"
            value="1,286"
            icon={<GroupIcon />}
            trend={5.8}
            subtitle="Last 30 days"
            color="primary"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Total unique patients in the system"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ModernStatCard
            title="Appointments"
            value="528"
            icon={<EventIcon />}
            trend={2.3}
            subtitle="Last 30 days"
            color="secondary"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Total scheduled appointments"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ModernStatCard
            title="Test Results"
            value="183"
            icon={<AssignmentIcon />}
            trend={-1.5}
            subtitle="Last 30 days"
            color="info"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="New lab and test results"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ModernStatCard
            title="Revenue"
            value="$86,432"
            icon={<TrendingUpIcon />}
            trend={8.2}
            subtitle="Last 30 days"
            color="success"
            variant="gradient"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Total revenue collected"
            status="success"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <GlassMorphicCard
            title="Patient Visits Trend"
            subtitle="Monthly overview of patient visits"
            icon={<TimelineIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size={isMobile ? 'small' : 'large'}
            fluid
          >
            <Box sx={{ height: { xs: 250, sm: 300, md: 350 }, mt: 1 }}>
              <SimpleAreaChart data={areaChartData} color={theme.palette.primary.main} />
            </Box>
          </GlassMorphicCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <GlassMorphicCard
            title="Department Distribution"
            subtitle="Distribution of patients by department"
            icon={<AnalyticsIcon />}
            glassEffect="medium"
            rounded="medium"
            borderHighlight
            size={isMobile ? 'small' : 'large'}
            fluid
          >
            <Box sx={{ height: { xs: 250, sm: 300, md: 350 }, mt: 1 }}>
              <SimplePieChart data={pieChartData} />
            </Box>
          </GlassMorphicCard>
        </Grid>
      </Grid>

      {/* Second Row Stats with Glass Effect */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Patient Satisfaction"
            value="92%"
            icon={<FavoriteIcon />}
            color="#e91e63"
            variant="glass"
            chart={<SimpleBarChart data={barChartData.slice(0, 4)} color="#e91e63" />}
            size={isTablet ? 'small' : 'medium'}
            fluid
            status="success"
            tooltipText="Overall patient satisfaction rate"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Average Wait Time"
            value="14 min"
            icon={<ScheduleIcon />}
            color="#ff9800"
            variant="glass"
            chart={<SimpleBarChart data={barChartData.slice(2, 6)} color="#ff9800" />}
            size={isTablet ? 'small' : 'medium'}
            fluid
            status="warning"
            tooltipText="Average patient wait time"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Medical Staff"
            value="52"
            icon={<HealthcareIcon />}
            color="#3f51b5"
            variant="glass"
            chart={<SimpleBarChart data={barChartData.slice(1, 5)} color="#3f51b5" />}
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Total medical staff"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="System Performance"
            value="99.2%"
            icon={<SpeedIcon />}
            color="#4caf50"
            variant="glass"
            chart={<SimpleBarChart data={barChartData.slice(3, 7)} color="#4caf50" />}
            size={isTablet ? 'small' : 'medium'}
            fluid
            status="success"
            tooltipText="Overall system uptime and performance"
          />
        </Grid>
      </Grid>

      {/* Additional Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <ModernStatCard
            title="Urgent Cases"
            value="8"
            icon={<FavoriteIcon />}
            color="error"
            variant="outlined"
            pulseEffect
            size={isTablet ? 'small' : 'medium'}
            fluid
            status="error"
            tooltipText="Current urgent cases requiring attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ModernStatCard
            title="Lab Results Pending"
            value="23"
            icon={<AssignmentIcon />}
            color="warning"
            variant="outlined"
            size={isTablet ? 'small' : 'medium'}
            fluid
            status="warning"
            tooltipText="Lab results awaiting review"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <ModernStatCard
            title="Available Rooms"
            value="14"
            icon={<EventIcon />}
            color="info"
            variant="outlined"
            size={isTablet ? 'small' : 'medium'}
            fluid
            tooltipText="Currently available examination rooms"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 