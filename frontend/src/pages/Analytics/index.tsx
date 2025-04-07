import React, { Suspense } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  Container,
  useTheme,
  alpha,
  Divider,
  IconButton,
  Button,
  CircularProgress,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreHoriz as MoreHorizIcon,
  CalendarToday as CalendarIcon,
  ArrowRightAlt as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// You would typically use a chart library like recharts, chart.js, or visx here
// This is a placeholder for visualization components

const Analytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = React.useState('week');
  const [tabValue, setTabValue] = React.useState(0);

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for analytics
  const statsData = [
    { title: 'Total Patients', value: '2,845', change: '+12%', trend: 'up' },
    { title: 'Avg. Wait Time', value: '18 min', change: '-7%', trend: 'down' },
    { title: 'Bed Utilization', value: '72%', change: '+3%', trend: 'up' },
    { title: 'Staff Efficiency', value: '94%', change: '+5%', trend: 'up' },
  ];

  // Mock data for patient demographics
  const demographics = {
    age: [
      { group: '0-17', value: 18 },
      { group: '18-34', value: 22 },
      { group: '35-50', value: 28 },
      { group: '51-65', value: 20 },
      { group: '65+', value: 12 },
    ],
    conditions: [
      { name: 'Cardiovascular', count: 342 },
      { name: 'Respiratory', count: 273 },
      { name: 'Neurological', count: 182 },
      { name: 'Orthopedic', count: 154 },
      { name: 'Gastrointestinal', count: 129 },
    ],
  };

  // Chart bars with custom styling
  const renderBarChart = (data: { group: string; value: number }[]) => (
    <Box sx={{ mt: 2 }}>
      {data.map((item) => (
        <Box key={item.group} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{item.group}</Typography>
            <Typography variant="body2" fontWeight={600}>{item.value}%</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 10, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 5 }}>
            <Box
              sx={{
                height: '100%',
                width: `${item.value}%`,
                borderRadius: 5,
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );

  // Pill-style list for conditions
  const renderConditions = (data: { name: string; count: number }[]) => (
    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {data.map((item) => (
        <Box
          key={item.name}
          sx={{
            py: 0.75,
            px: 2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: 140,
          }}
        >
          <Typography variant="body2">{item.name}</Typography>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {item.count}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ 
      position: 'relative', 
      height: 'auto',
      minHeight: '100%', 
      zIndex: 5, 
      mt: 2, 
      overflow: 'visible',
      backgroundColor: theme => theme.palette.background.paper,
      padding: 3,
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Decorative background wave pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: theme.palette.mode === 'dark' ? 
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23FFFFFF'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")` :
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23222222' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23222222'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Curved header section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'relative',
          mb: 5,
          borderRadius: '24px',
          overflow: 'hidden',
          background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          p: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: (theme) => `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)} 0%, transparent 70%)`,
            borderRadius: '50%',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 1, position: 'relative', zIndex: 2 }}>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: '70%', position: 'relative', zIndex: 2 }}>
              Track and analyze key performance metrics across all departments
            </Typography>
          </Box>
          <Button 
            startIcon={<RefreshIcon />}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Analytics summary cards */}
      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
        {/* Patient Admissions */}
        <Grid item xs={12} md={3}>
          <Box
            component={motion.div}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              sx={{ 
                p: 2.5, 
                borderRadius: '16px', 
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.success.main, 0.1),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -40,
                  bottom: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.15)} 0%, transparent 70%)`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Patient Admissions
                  </Typography>
                  <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                    1,248
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowUpwardIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: '12px',
                    width: 40,
                    height: 40
                  }}
                >
                  <TrendingUpIcon color="success" />
                </IconButton>
              </Box>
            </Card>
          </Box>
        </Grid>
        
        {/* Emergency Cases */}
        <Grid item xs={12} md={3}>
          <Box
            component={motion.div}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              sx={{ 
                p: 2.5, 
                borderRadius: '16px', 
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.warning.main, 0.1),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -40,
                  bottom: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.15)} 0%, transparent 70%)`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Emergency Cases
                  </Typography>
                  <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                    384
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowDownwardIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="error.main" fontWeight={500}>
                      -3.2%
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    borderRadius: '12px',
                    width: 40,
                    height: 40
                  }}
                >
                  <TrendingDownIcon color="warning" />
                </IconButton>
              </Box>
            </Card>
          </Box>
        </Grid>
        
        {/* Staff Efficiency */}
        <Grid item xs={12} md={3}>
          <Box
            component={motion.div}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card
              sx={{ 
                p: 2.5, 
                borderRadius: '16px', 
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -40,
                  bottom: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Staff Efficiency
                  </Typography>
                  <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                    87%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowUpwardIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                      +5.7%
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '12px',
                    width: 40,
                    height: 40
                  }}
                >
                  <TrendingUpIcon color="primary" />
                </IconButton>
              </Box>
            </Card>
          </Box>
        </Grid>
        
        {/* Resource Utilization */}
        <Grid item xs={12} md={3}>
          <Box
            component={motion.div}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card
              sx={{ 
                p: 2.5, 
                borderRadius: '16px', 
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.info.main, 0.1),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -40,
                  bottom: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.15)} 0%, transparent 70%)`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Resource Utilization
                  </Typography>
                  <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                    92%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowUpwardIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                      +2.3%
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    borderRadius: '12px',
                    width: 40,
                    height: 40
                  }}
                >
                  <TrendingUpIcon color="info" />
                </IconButton>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
      
      {/* Main analytics content */}
      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={8}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card
              sx={{ 
                p: 3, 
                borderRadius: '20px',
                background: (theme) => alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                height: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 0.1),
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Patient Admission Trends
                </Typography>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              
              {/* Chart placeholder */}
              <Box 
                sx={{ 
                  height: 300, 
                  width: '100%', 
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography color="text.secondary">
                  Chart visualization would appear here
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card
              sx={{ 
                p: 3, 
                borderRadius: '20px',
                background: (theme) => alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                height: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 0.1),
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: (theme) => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Department Performance
                </Typography>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              
              {/* Performance stats */}
              <Box sx={{ mt: 2 }}>
                {['Emergency', 'Cardiology', 'Pediatrics', 'Neurology'].map((dept, index) => (
                  <React.Fragment key={dept}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {dept}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {85 + index * 3}%
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        height: 8, 
                        borderRadius: '4px', 
                        background: alpha(theme.palette.divider, 0.1),
                        mb: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${85 + index * 3}%`, 
                          borderRadius: '4px',
                          background: (theme) => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`
                        }}
                      />
                    </Box>
                    {index < 3 && <Divider sx={{ opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

// Wrap Analytics with Suspense to handle chart loading
const AnalyticsWithFallback = () => {
  return (
    <Suspense fallback={
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <Analytics />
    </Suspense>
  );
};

export default AnalyticsWithFallback; 