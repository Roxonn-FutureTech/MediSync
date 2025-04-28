import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Button,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  Compare as CompareIcon,
  AccessTime as AccessTimeIcon,
  AutoGraph as AutoGraphIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';

// Mock chart component that displays a performance graph
const PerformanceChart: React.FC<{
  type: string;
  color: string;
  height?: number;
}> = ({ type, color, height = 200 }) => {
  const theme = useTheme();

  // Mock chart data with a sine wave
  const generateChartData = () => {
    const points = 20;
    return Array(points).fill(0).map((_, i) => {
      const randomVariation = Math.random() * 20 - 10;
      const value = 50 + Math.sin(i / (points / (Math.PI * 2))) * 30 + randomVariation;
      return Math.max(5, Math.min(95, value));
    });
  };

  const chartData = generateChartData();

  return (
    <Box
      sx={{
        position: 'relative',
        height: height,
        width: '100%',
        mt: 2,
        mb: 1,
      }}
    >
      {/* X-Axis Labels */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 20,
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time, index) => (
          <Typography key={index} variant="caption" color="text.secondary">
            {time}
          </Typography>
        ))}
      </Box>

      {/* Chart Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          bottom: 20,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Fill area under line */}
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M0,${100 - chartData[0]} ${chartData.map((value, i) => `L${(i / (chartData.length - 1)) * 100},${100 - value}`).join(' ')} V100 H0 Z`}
            fill={`url(#gradient-${type})`}
          />
          <path
            d={`M0,${100 - chartData[0]} ${chartData.map((value, i) => `L${(i / (chartData.length - 1)) * 100},${100 - value}`).join(' ')}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          {/* Last data point dot */}
          <circle 
            cx="100" 
            cy={100 - chartData[chartData.length - 1]} 
            r="4" 
            fill={color} 
          />
        </svg>
      </Box>

      {/* Current Value Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 0,
          py: 0.5,
          px: 1,
          bgcolor: alpha(color, 0.1),
          borderRadius: 1,
          color: color,
          fontWeight: 'bold',
          fontSize: '0.75rem',
        }}
      >
        {chartData[chartData.length - 1].toFixed(1)}%
      </Box>
    </Box>
  );
};

const PerformanceMetrics: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('24h');
  const [server, setServer] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Controls Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="6h">Last 6 Hours</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Servers</MenuItem>
              <MenuItem value="web1">Web Server</MenuItem>
              <MenuItem value="app1">Application Server</MenuItem>
              <MenuItem value="db1">Database Server</MenuItem>
              <MenuItem value="cache1">Cache Server</MenuItem>
            </Select>
          </FormControl>
          
          <Button startIcon={<CompareIcon />} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
            Compare
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download report">
            <IconButton size="small">
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      
      {/* Real-time Metrics Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <SpeedIcon />
            </Box>
            <CardContent sx={{ pt: 4, pl: 2 }}>
              <Box sx={{ ml: 5, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  CPU Usage
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  42%
                </Typography>
                <Chip 
                  label="+3% vs last hour" 
                  size="small"
                  icon={<AutoGraphIcon sx={{ width: 14, height: 14 }} />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    color: theme.palette.warning.main,
                    fontWeight: 600,
                    mt: 1,
                    fontSize: '0.75rem',
                    height: 24,
                  }} 
                />
              </Box>
              <PerformanceChart type="cpu" color={theme.palette.primary.main} height={100} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <MemoryIcon />
            </Box>
            <CardContent sx={{ pt: 4, pl: 2 }}>
              <Box sx={{ ml: 5, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Memory Usage
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  67%
                </Typography>
                <Chip 
                  label="-1.2% vs last hour" 
                  size="small"
                  icon={<AutoGraphIcon sx={{ width: 14, height: 14 }} />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main,
                    fontWeight: 600,
                    mt: 1,
                    fontSize: '0.75rem',
                    height: 24,
                  }} 
                />
              </Box>
              <PerformanceChart type="memory" color={theme.palette.secondary.main} height={100} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <StorageIcon />
            </Box>
            <CardContent sx={{ pt: 4, pl: 2 }}>
              <Box sx={{ ml: 5, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Disk Usage
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  78%
                </Typography>
                <Chip 
                  label="+0.5% vs last hour" 
                  size="small"
                  icon={<AutoGraphIcon sx={{ width: 14, height: 14 }} />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1), 
                    color: theme.palette.info.main,
                    fontWeight: 600,
                    mt: 1,
                    fontSize: '0.75rem',
                    height: 24,
                  }} 
                />
              </Box>
              <PerformanceChart type="disk" color={theme.palette.success.main} height={100} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <NetworkIcon />
            </Box>
            <CardContent sx={{ pt: 4, pl: 2 }}>
              <Box sx={{ ml: 5, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Network Traffic
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  35%
                </Typography>
                <Chip 
                  label="+12% vs last hour" 
                  size="small"
                  icon={<AutoGraphIcon sx={{ width: 14, height: 14 }} />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    color: theme.palette.warning.main,
                    fontWeight: 600,
                    mt: 1,
                    fontSize: '0.75rem',
                    height: 24,
                  }} 
                />
              </Box>
              <PerformanceChart type="network" color={theme.palette.warning.main} height={100} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Detailed Metrics */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Detailed Metrics
              </Typography>
              <Box>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <FullscreenIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': { 
                  minWidth: 120,
                  fontWeight: 600,
                  textTransform: 'none',
                }
              }}
            >
              <Tab label="System" />
              <Tab label="Application" />
              <Tab label="Database" />
              <Tab label="Network" />
            </Tabs>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 3, height: 400, position: 'relative' }}>
            {activeTab === 0 && (
              <Box sx={{ height: '100%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      System Resource Utilization
                    </Typography>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 2,
                        height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {/* Placeholder for chart */}
                      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                        <PerformanceChart type="combined" color={theme.palette.primary.main} height={280} />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Resource Stats
                    </Typography>
                    <Stack spacing={2}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                mr: 1.5,
                              }}
                            >
                              <SpeedIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Average CPU</Typography>
                              <Typography variant="subtitle1" fontWeight={600}>38.2%</Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label="Normal" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(theme.palette.success.main, 0.1), 
                              color: theme.palette.success.main,
                              fontWeight: 600,
                            }} 
                          />
                        </Box>
                      </Paper>
                      
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: theme.palette.secondary.main,
                                mr: 1.5,
                              }}
                            >
                              <MemoryIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Memory Peak</Typography>
                              <Typography variant="subtitle1" fontWeight={600}>4.8 GB</Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label="Normal" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(theme.palette.success.main, 0.1), 
                              color: theme.palette.success.main,
                              fontWeight: 600,
                            }} 
                          />
                        </Box>
                      </Paper>
                      
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.warning.main, 0.05),
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                mr: 1.5,
                              }}
                            >
                              <AccessTimeIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Avg. Response</Typography>
                              <Typography variant="subtitle1" fontWeight={600}>187 ms</Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label="Warning" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(theme.palette.warning.main, 0.1), 
                              color: theme.palette.warning.main,
                              fontWeight: 600,
                            }} 
                          />
                        </Box>
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Application metrics content
                </Typography>
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Database metrics content
                </Typography>
              </Box>
            )}
            
            {activeTab === 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Network metrics content
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PerformanceMetrics; 