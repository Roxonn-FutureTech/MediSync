import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Badge,
  LinearProgress,
  Alert,
  Tooltip,
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Skeleton,
  SwipeableDrawer,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Timer,
  LocalHospital,
  Phone,
  Email,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  CalendarMonth as CalendarIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  BarChart as StatsIcon,
  PersonAdd as PersonAddIcon,
  FilterAlt as FilterAltIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface Performance {
  responseTime: number;
  casesHandled: number;
  successRate: number;
  rating: number;
  lastMonth: {
    total: number;
    successful: number;
    critical: number;
  };
}

interface Schedule {
  current: string;
  next: string;
  totalHours: number;
  overtimeHours: number;
  upcomingShifts: {
    date: string;
    time: string;
    hospital: string;
  }[];
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: 'on-duty' | 'off-duty' | 'on-call';
  location: string;
  hospital: string;
  phone: string;
  email: string;
  shift: string;
  specialty?: string;
  avatar: string;
  nextShift?: string;
  experience: string;
  certifications: string[];
  performance: Performance;
  schedule: Schedule;
  lastActive: string;
}

// Enhanced mock data
const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Emergency Physician',
    status: 'on-duty',
    location: 'ER Wing',
    hospital: 'Central Hospital',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@medisync.com',
    shift: '7:00 AM - 7:00 PM',
    specialty: 'Trauma Care',
    avatar: 'SJ',
    experience: '10 years',
    certifications: ['ABEM', 'ACLS', 'ATLS'],
    performance: {
      responseTime: 4.2,
      casesHandled: 127,
      successRate: 95.5,
      rating: 4.8,
      lastMonth: {
        total: 45,
        successful: 43,
        critical: 12,
      },
    },
    schedule: {
      current: 'Day Shift',
      next: 'Tomorrow, 7:00 AM',
      totalHours: 160,
      overtimeHours: 12,
      upcomingShifts: [
        {
          date: '2024-03-16',
          time: '7:00 AM - 7:00 PM',
          hospital: 'Central Hospital',
        },
        {
          date: '2024-03-17',
          time: '7:00 AM - 7:00 PM',
          hospital: 'Central Hospital',
        },
      ],
    },
    lastActive: '2 minutes ago',
  },
  // Add more staff members with similar detailed data
];

// Add these styles at the top level
const CARD_TRANSITION = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
const HOVER_ELEVATION = 8;

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>(staffMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty':
        return 'success';
      case 'off-duty':
        return 'error';
      case 'on-call':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Box 
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{ 
        p: 3,
        background: theme => `linear-gradient(135deg, 
          ${alpha(theme.palette.background.default, 0.9)},
          ${alpha(theme.palette.background.default, 0.7)}),
          url('/assets/medical-bg-pattern.png')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        p: 3,
        bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
        boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component={motion.h4}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            fontWeight="bold" 
            sx={{
              background: theme => `linear-gradient(45deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              mb: 1
            }}
          >
            Staff Management
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            component={motion.p}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredStaff.length} staff members • {
              filteredStaff.filter(m => m.status === 'on-duty').length
            } on duty
          </Typography>
        </Box>

        <Stack 
          direction="row" 
          spacing={2}
          component={motion.div}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, value) => value && setViewType(value)}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Grid View">
                <GridViewIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List View">
                <ListViewIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={() => setShowFilters(true)}
            sx={{
              borderRadius: 2,
              transition: CARD_TRANSITION,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              }
            }}
          >
            Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              background: theme => `linear-gradient(45deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main})`,
              transition: CARD_TRANSITION,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            Add Staff
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Fade in={showFilters}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search staff by name, role, or location..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  sx: {
                    borderRadius: 2,
                    bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    transition: CARD_TRANSITION,
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.background.paper, 0.95),
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filterRole}
                  label="Role"
                  onChange={(e) => setFilterRole(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    transition: CARD_TRANSITION,
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.background.paper, 0.95),
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="Emergency Physician">Emergency Physician</MenuItem>
                  <MenuItem value="Paramedic">Paramedic</MenuItem>
                  <MenuItem value="Emergency Nurse">Emergency Nurse</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    transition: CARD_TRANSITION,
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.background.paper, 0.95),
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="on-duty">On Duty</MenuItem>
                  <MenuItem value="off-duty">Off Duty</MenuItem>
                  <MenuItem value="on-call">On Call</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Staff Cards Grid/List */}
      <Box
        component={motion.div}
        variants={containerVariants}
        sx={{ 
          position: 'relative',
          minHeight: 400
        }}
      >
        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} lg={6} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {filteredStaff.map((member) => (
              <Grid 
                item 
                xs={12} 
                lg={viewType === 'grid' ? 6 : 12} 
                key={member.id}
                component={motion.div}
                variants={itemVariants}
              >
                <Card
                  component={motion.div}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transition: { duration: 0.3 }
                  }}
                  sx={{ 
                    borderRadius: 3,
                    background: theme => alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: theme => alpha(theme.palette.divider, 0.1),
                    '&:hover': {
                      '& .performance-card': {
                        transform: 'scale(1.02)',
                      },
                      '& .quick-actions': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header section */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1, sm: 1.5 },
                      mb: 2 
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        gap: 1.5,
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color={getStatusColor(member.status)}
                          >
                            <Avatar
                              sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                bgcolor: 'primary.main',
                                fontSize: { xs: '1rem', sm: '1.2rem' },
                              }}
                            >
                              {member.avatar}
                            </Avatar>
                          </Badge>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                              {member.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {member.role}
                            </Typography>
                            <Chip
                              size="small"
                              label={member.status.replace('-', ' ').toUpperCase()}
                              color={getStatusColor(member.status)}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={() => setSelectedStaff(member)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Performance and Schedule section */}
                    <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: 'auto' }}>
                      <Grid item xs={12} sm={6}>
                        <Card 
                          variant="outlined" 
                          className="performance-card"
                          sx={{ 
                            borderRadius: 2,
                            height: '100%',
                            transition: CARD_TRANSITION,
                            background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <CardContent sx={{ 
                            p: { xs: 1, sm: 1.5 }, 
                            '&:last-child': { pb: { xs: 1, sm: 1.5 } },
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Performance Metrics
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  mb: 0.5, 
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 0.5
                                }}>
                                  <Typography variant="caption" component="span" noWrap>
                                    Response Time
                                  </Typography>
                                  <Typography variant="caption" component="span" fontWeight="bold">
                                    {member.performance.responseTime} min
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min((member.performance.responseTime / 10) * 100, 100)}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 2,
                                      background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                    }
                                  }}
                                />
                              </Box>
                              <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  mb: 0.5, 
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 0.5
                                }}>
                                  <Typography variant="caption" component="span" noWrap>
                                    Success Rate
                                  </Typography>
                                  <Typography variant="caption" component="span" fontWeight="bold">
                                    {member.performance.successRate}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={member.performance.successRate}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2
                                  }}
                                />
                              </Box>
                            </Box>
                            <Stack 
                              direction="row" 
                              spacing={0.5} 
                              flexWrap="wrap" 
                              useFlexGap 
                              sx={{ gap: 0.5, mt: 'auto' }}
                            >
                              <Chip
                                size="small"
                                icon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
                                label={`${member.performance.casesHandled} cases`}
                                sx={{ 
                                  height: 24, 
                                  '& .MuiChip-label': { 
                                    px: 1, 
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap'
                                  } 
                                }}
                              />
                              <Chip
                                size="small"
                                icon={<StarIcon sx={{ fontSize: '1rem' }} />}
                                label={`${member.performance.rating} rating`}
                                sx={{ 
                                  height: 24, 
                                  '& .MuiChip-label': { 
                                    px: 1, 
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap'
                                  } 
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Card 
                          variant="outlined"
                          className="schedule-card"
                          sx={{ 
                            borderRadius: 2,
                            height: '100%',
                            transition: CARD_TRANSITION,
                            background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <CardContent sx={{ 
                            p: { xs: 1, sm: 1.5 }, 
                            '&:last-child': { pb: { xs: 1, sm: 1.5 } },
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Schedule
                            </Typography>
                            <List dense disablePadding sx={{ flex: 1 }}>
                              <ListItem dense sx={{ px: 0.5, py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <Timer sx={{ fontSize: '1rem' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="caption" component="span" noWrap>
                                      {member.schedule.current}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" component="span" color="text.secondary">
                                      Current
                                    </Typography>
                                  }
                                  sx={{ m: 0 }}
                                />
                              </ListItem>
                              <ListItem dense sx={{ px: 0.5, py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <CalendarIcon sx={{ fontSize: '1rem' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="caption" component="span" noWrap>
                                      {member.schedule.next}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" component="span" color="text.secondary">
                                      Next
                                    </Typography>
                                  }
                                  sx={{ m: 0 }}
                                />
                              </ListItem>
                            </List>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ mt: 'auto', display: 'block' }}
                              noWrap
                            >
                              {member.schedule.totalHours}h ({member.schedule.overtimeHours}h OT)
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Certifications section */}
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Certifications
                      </Typography>
                      <Stack 
                        direction="row" 
                        spacing={0.5} 
                        flexWrap="wrap" 
                        useFlexGap 
                        sx={{ gap: 0.5 }}
                      >
                        {member.certifications.map((cert, index) => (
                          <Chip
                            key={index}
                            label={cert}
                            size="small"
                            sx={{
                              height: 20,
                              '& .MuiChip-label': { 
                                px: 1, 
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap'
                              },
                              borderRadius: 1,
                              transition: CARD_TRANSITION,
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: 1,
                                bgcolor: theme => alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Footer section */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 0.5, sm: 0 }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        width: { xs: '100%', sm: 'auto' }
                      }}>
                        <LocationIcon sx={{ fontSize: '1rem' }} color="action" />
                        <Typography variant="caption" component="span" noWrap>
                          {member.location} • {member.hospital}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        component="span" 
                        color="text.secondary"
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                        noWrap
                      >
                        {member.lastActive}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Quick Actions Overlay */}
                <Box
                  className="quick-actions"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Tooltip title="Send Message">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      <MessageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Schedule">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      <ScheduleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Stats">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      <StatsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Staff Management Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => setShowSpeedDial(false)}
        onOpen={() => setShowSpeedDial(true)}
        open={showSpeedDial}
      >
        <SpeedDialAction
          icon={<PersonAddIcon />}
          tooltipTitle="Add Staff"
          onClick={() => setOpenDialog(true)}
        />
        <SpeedDialAction
          icon={<NotificationsIcon />}
          tooltipTitle="Send Notification"
          onClick={() => {/* Handle notification */}}
        />
        <SpeedDialAction
          icon={<ScheduleIcon />}
          tooltipTitle="Schedule Management"
          onClick={() => {/* Handle schedule */}}
        />
        <SpeedDialAction
          icon={<StatsIcon />}
          tooltipTitle="View Analytics"
          onClick={() => {/* Handle analytics */}}
        />
      </SpeedDial>

      {/* Filters Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        onOpen={() => setShowFilters(true)}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: '16px 0 0 16px',
            bgcolor: theme => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        {/* Add filter content */}
      </SwipeableDrawer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle>
          {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          {/* Add form fields for staff data */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            {selectedStaff ? 'Save Changes' : 'Add Staff'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}