import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme as useMuiTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemButton,
  Avatar,
  Badge,
  alpha,
  Tooltip,
  Switch,
  FormControlLabel,
  Button,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalHospital,
  Warning as WarningIcon,
  People,
  Settings,
  PersonAdd,
  ChevronLeft as ChevronLeftIcon,
  Notifications,
  AccountCircle,
  DarkMode,
  LightMode,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DirectionsRun,
  BrightnessAuto,
  Brightness4,
  Brightness7,
  Computer,
  NightsStay,
  WbSunny,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import EmergencyAlertBanner from '../common/EmergencyAlertBanner';

const drawerWidth = {
  xs: 240,
  sm: 260,
  md: 280
};

const getDrawerWidth = (breakpoint) => {
  if (typeof drawerWidth === 'object') {
    return drawerWidth[breakpoint] || drawerWidth.xs;
  }
  return drawerWidth;
};

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Hospitals', icon: <LocalHospital />, path: '/hospitals' },
  { text: 'Emergencies', icon: <WarningIcon />, path: '/emergencies' },
  { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
  { text: 'Staff', icon: <People />, path: '/staff' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// Animation variants
const drawerVariants: Variants = {
  open: (breakpoint) => ({
    width: getDrawerWidth(breakpoint),
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }),
  closed: {
    width: 72,
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  mobile: {
    width: getDrawerWidth('xs'),
    x: 0,
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  mobileClosed: {
    width: getDrawerWidth('xs'),
    x: -getDrawerWidth('xs'),
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

const contentVariants: Variants = {
  open: (breakpoint) => ({
    marginLeft: getDrawerWidth(breakpoint),
    width: `calc(100% - ${getDrawerWidth(breakpoint)}px)`,
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }),
  closed: {
    marginLeft: 72,
    width: `calc(100% - 72px)`,
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  mobile: {
    marginLeft: 0,
    width: '100%',
    transition: { 
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

const menuItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.03,
      duration: 0.2,
    }
  }),
  hover: {
    x: 5,
    transition: { 
      duration: 0.2, 
    }
  }
};

// Demo emergency alerts
const demoEmergencyAlerts = [
  {
    id: '1',
    type: 'Cardiac Emergency',
    location: 'Central Hospital, Floor 3',
    timestamp: new Date().toISOString(),
    severity: 'critical' as const,
    details: 'Patient experiencing severe chest pain and shortness of breath. Requires immediate cardiac team response.',
    actionRequired: true
  },
  {
    id: '2',
    type: 'Multi-Vehicle Accident',
    location: 'Highway 101, Mile 23',
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
    severity: 'major' as const,
    details: 'Multiple injuries reported at the scene. Paramedics and fire department dispatched. Expecting casualties to be transported to nearby hospitals.',
    actionRequired: false
  }
];

const Layout = () => {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme, isSystemTheme, toggleSystemTheme, setIsSystemTheme, setThemeMode } = useTheme();
  const { notifications, showNotification, requestPermission } = useNotification();
  const { user, logout } = useAuth();
  const notificationCount = notifications.length;
  const shouldReduceMotion = useReducedMotion();
  
  const [scrolled, setScrolled] = useState(false);
  const [alerts, setAlerts] = useState(demoEmergencyAlerts);
  const breakpoint = isMobile ? 'xs' : muiTheme.breakpoints.up('md') ? 'md' : 'sm';
  
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    requestPermission();
    
    showNotification(
      'Welcome to MediSync! Your emergency response system is active.',
      'success',
      'System Status'
    );

    const timer = setTimeout(() => {
      showNotification(
        'New emergency case reported in Downtown Area',
        'warning',
        'Emergency Alert'
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [showNotification, requestPermission]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 20 && !scrolled) {
      setScrolled(true);
    } else if (scrollTop <= 20 && scrolled) {
      setScrolled(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };
  
  const handleAlertClose = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  const handleAlertRespond = (id: string) => {
    navigate('/emergencies');
    // Don't close the alert so it's still visible when they get to the page
  };

  const getAnimationProps = () => {
    if (shouldReduceMotion) return {};
    
    if (isMobile) {
      return {
        variants: drawerVariants,
        animate: drawerOpen ? 'mobile' : 'mobileClosed',
        initial: 'mobileClosed',
        custom: 'xs'
      };
    }
    
    return {
      variants: drawerVariants,
      animate: drawerOpen ? 'open' : 'closed',
      initial: 'closed',
      custom: breakpoint
    };
  };

  const getContentAnimationProps = () => {
    if (shouldReduceMotion) return {};
    
    if (isMobile) {
      return {
        variants: contentVariants,
        animate: 'mobile',
        initial: 'mobile'
      };
    }
    
    return {
      variants: contentVariants,
      animate: drawerOpen ? 'open' : 'closed',
      initial: 'closed',
      custom: breakpoint
    };
  };

  const isMenuActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: muiTheme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(
            muiTheme.palette.background.default,
            scrolled ? (mode === 'light' ? 0.85 : 0.92) : (mode === 'light' ? 0.7 : 0.85)
          ),
          boxShadow: scrolled ? muiTheme.shadows[3] : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: `1px solid ${alpha(muiTheme.palette.divider, scrolled ? 0.1 : 0.05)}`,
          height: { xs: 64, sm: 70, md: 70 },
        }}
      >
        <Toolbar sx={{ height: '100%', px: { xs: 1.5, sm: 2.5, md: 3 } }}>
          <Box 
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: { xs: 1, sm: 2 },
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
            <Box 
              component={motion.div} 
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -20 }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Avatar 
                  src="/logo192.png"
                  sx={{ 
                    width: { xs: 34, sm: 38, md: 42 }, 
                    height: { xs: 34, sm: 38, md: 42 }, 
                    backgroundColor: 'primary.main',
                    mr: 1.5,
                    boxShadow: `0 0 10px ${alpha(muiTheme.palette.primary.main, 0.5)}`
                  }}
                >
                  <LocalHospital sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                </Avatar>
              </motion.div>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  background: `linear-gradient(90deg, ${muiTheme.palette.primary.main} 0%, ${muiTheme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  fontSize: { xs: '1.15rem', sm: '1.25rem', md: '1.4rem' }
                }}
              >
                MediSync
              </Typography>
            </Box>
            
            {/* Search bar - Shown on larger screens */}
            <Box
              sx={{
                position: 'relative',
                ml: { xs: 2, sm: 3, md: 4 },
                mr: 2,
                backgroundColor: alpha(muiTheme.palette.common[mode === 'light' ? 'black' : 'white'], 0.07),
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: alpha(muiTheme.palette.common[mode === 'light' ? 'black' : 'white'], 0.09),
                },
                width: { xs: 'auto', sm: '200px', md: '300px', lg: '380px' },
                display: { xs: 'none', sm: 'flex' },
                transition: 'all 0.3s ease',
              }}
            >
              <IconButton sx={{ p: { xs: '8px', sm: '10px' } }} aria-label="search">
                <SearchIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
              <Box
                component="input"
                sx={{
                  border: 'none',
                  padding: muiTheme.spacing(1, 1, 1, 0),
                  width: '100%',
                  outline: 'none',
                  color: 'inherit',
                  backgroundColor: 'transparent',
                  borderRadius: '24px',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&::placeholder': {
                    color: alpha(muiTheme.palette.text.primary, 0.5),
                  }
                }}
                placeholder="Search…"
              />
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Add new button - Hidden on xs screens */}
            <Tooltip title="Create New">
              <IconButton
                color="primary"
                sx={{ 
                  mr: { sm: 1 },
                  backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(muiTheme.palette.primary.main, 0.2),
                  },
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                <AddIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={handleNotificationMenuOpen}
                sx={{ 
                  ml: { xs: 0.5, sm: 1 },
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                }}
              >
                <Badge 
                  badgeContent={notificationCount} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      height: { xs: 16, sm: 18 },
                      minWidth: { xs: 16, sm: 18 },
                    }
                  }}
                >
                  <Notifications sx={{ fontSize: { xs: 20, sm: 22 } }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton 
                color="inherit" 
                onClick={toggleTheme}
                sx={{ 
                  ml: { xs: 0.5, sm: 1 },
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                }}
              >
                {mode === 'dark' ? 
                  <Brightness7 sx={{ fontSize: { xs: 20, sm: 22 } }} /> : 
                  <Brightness4 sx={{ fontSize: { xs: 20, sm: 22 } }} />
                }
              </IconButton>
            </Tooltip>

            {/* Profile avatar */}
            <Box sx={{ ml: { xs: 1, sm: 1.5 } }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{ 
                      p: 0,
                      border: `2px solid ${alpha(muiTheme.palette.primary.main, 0.5)}`,
                      overflow: 'hidden'
                    }}
                  >
                    <Avatar 
                      alt="User" 
                      src="/user-avatar.png"
                      sx={{ 
                        width: { xs: 32, sm: 36, md: 38 }, 
                        height: { xs: 32, sm: 36, md: 38 },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </motion.div>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        keepMounted
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1.5,
            borderRadius: 2,
            overflow: 'visible',
            boxShadow: muiTheme.shadows[8],
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
        </Box>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                <Box 
                  sx={{ 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: alpha(
                      notification.type === 'success' 
                        ? muiTheme.palette.success.main 
                        : notification.type === 'warning'
                        ? muiTheme.palette.warning.main
                        : notification.type === 'error'
                        ? muiTheme.palette.error.main
                        : muiTheme.palette.primary.main,
                      0.12
                    ),
                    color: notification.type === 'success' 
                      ? muiTheme.palette.success.main 
                      : notification.type === 'warning'
                      ? muiTheme.palette.warning.main
                      : notification.type === 'error'
                      ? muiTheme.palette.error.main
                      : muiTheme.palette.primary.main,
                    mr: 2
                  }}
                >
                  {notification.type === 'success' ? <CheckCircleIcon /> : 
                   notification.type === 'warning' ? <WarningIcon /> :
                   notification.type === 'error' ? <ErrorIcon /> : <InfoIcon />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Just now
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
        {notifications.length > 0 && (
          <Box sx={{ p: 1.5, borderTop: `1px solid ${muiTheme.palette.divider}`, textAlign: 'center' }}>
            <Button 
              size="small" 
              onClick={handleNotificationMenuClose}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              View all notifications
            </Button>
          </Box>
        )}
      </Menu>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            boxShadow: muiTheme.shadows[8],
            maxWidth: 220,
            borderRadius: 2,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box 
          sx={{ 
            p: 2,
            borderBottom: `1px solid ${muiTheme.palette.divider}`,
            borderTopLeftRadius: muiTheme.shape.borderRadius,
            borderTopRightRadius: muiTheme.shape.borderRadius,
            backgroundColor: alpha(muiTheme.palette.primary.main, 0.05),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt="User" 
              src="/user-avatar.png"
              sx={{ 
                width: 40, 
                height: 40,
                mr: 1.5,
                boxShadow: `0 2px 6px ${alpha(muiTheme.palette.common.black, 0.2)}`
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Dr. Sarah Johnson</Typography>
              <Typography variant="body2" color="text.secondary">Emergency Physician</Typography>
            </Box>
          </Box>
        </Box>
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={isMobile ? handleDrawerToggle : undefined}
        component={motion.div}
        {...getAnimationProps()}
        sx={{
          width: drawerOpen ? drawerWidth : 72,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            backgroundColor: alpha(muiTheme.palette.background.default, mode === 'light' ? 0.97 : 0.95),
            width: drawerOpen ? drawerWidth : 72,
            border: 'none',
            overflow: 'hidden',
            boxShadow: drawerOpen ? muiTheme.shadows[4] : 'none',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            pt: 1,
          }}
        >
          <List sx={{ pt: 0 }}>
            {menuItems.map((item, index) => (
              <ListItem 
                key={item.text} 
                disablePadding 
                sx={{ display: 'block', mb: 0.5 }}
                component={motion.div}
                variants={menuItemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isMenuActive(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 2,
                    mx: 1,
                    px: 2.5,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&.Mui-selected': {
                      backgroundColor: alpha(muiTheme.palette.primary.main, 0.12),
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: 4,
                        backgroundColor: muiTheme.palette.primary.main,
                        borderRadius: '0 4px 4px 0',
                      },
                      '&:hover': {
                        backgroundColor: alpha(muiTheme.palette.primary.main, 0.16),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isMenuActive(item.path) ? muiTheme.palette.primary.main : muiTheme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: drawerOpen ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: isMenuActive(item.path) ? 600 : 500,
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ borderColor: alpha(muiTheme.palette.divider, 0.5) }} />
          <Box sx={{ p: 2, textAlign: 'center', display: drawerOpen ? 'block' : 'none' }}>
            <Typography variant="caption" color="text.secondary">
              MediSync v1.0.0
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              © 2023 MediSync Systems
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component={motion.div}
        {...getContentAnimationProps()}
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          px: { xs: 0.75, sm: 1.25, md: 2 },
          pt: { xs: 0.75, sm: 1, md: 1.5 },
          pb: { xs: 1, sm: 1.5, md: 2 },
          mt: { xs: '64px', sm: '70px', md: '70px' }, // AppBar height
          transition: 'all 0.3s ease',
        }}
        onScroll={handleScroll}
      >
        {/* Emergency Alerts */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <AnimatePresence>
            {alerts.map(alert => (
              <EmergencyAlertBanner
                key={alert.id}
                id={alert.id}
                type={alert.type}
                location={alert.location}
                timestamp={alert.timestamp}
                severity={alert.severity}
                details={alert.details}
                onClose={() => handleAlertClose(alert.id)}
                onRespond={() => handleAlertRespond(alert.id)}
                actionRequired={alert.actionRequired}
              />
            ))}
          </AnimatePresence>
        </Box>
        
        {/* Page Content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 