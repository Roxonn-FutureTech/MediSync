import React, { useState, useContext, Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import {
  Box,
  CssBaseline,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  alpha,
  useTheme,
  FormControlLabel,
  Switch,
  CircularProgress,
  Chip,
  Container,
  Breadcrumbs,
  Menu,
  MenuItem,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as ProfileIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccessTime as AccessTimeIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Notifications as NotificationsIcon,
  DeviceHub as SystemIcon,
  Dashboard as DashboardIcon,
  LocalHospital,
  MedicalServices,
  PersonOutline as PatientIcon,
  People as PeopleIcon,
  BarChart as AnalyticsIcon,
  Map as MapIcon,
  SupportAgent as SupportIcon,
  History as HistoryIcon,
  Help as HelpIcon,
  MonitorHeartOutlined,
} from '@mui/icons-material';
import { ColorModeContext } from '../../contexts/ColorModeContext';
import { motion } from 'framer-motion';
import { styled, CSSObject } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import GlobalSearch from '../GlobalSearch';

const drawerWidth = 260;

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : 72,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    position: 'relative',
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    ...(open && {
      width: drawerWidth,
      overflowX: 'hidden',
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
      },
    }),
    ...(!open && {
      width: 72,
      overflowX: 'hidden',
      '& .MuiDrawer-paper': {
        width: 72,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
      },
    }),
  }),
);

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - 72px)`,
    marginLeft: 72,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Layout(props: { window?: () => Window }) {
  const { window } = props;
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const mode = theme.palette.mode;
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState<null | HTMLElement>(null);
  const [notificationsMenu, setNotificationsMenu] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenu(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenu(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  const handleLogout = () => {
    handleAccountMenuClose();
    logout();
  };

  const menuItems = [
    {
      category: "Main",
      items: [
        { 
          text: 'Dashboard',
          icon: <DashboardIcon />,
          path: ''
        },
        { 
          text: 'Hospitals',
          icon: <LocalHospital />,
          path: 'hospitals'
        },
        { 
          text: 'Emergencies',
          icon: <MedicalServices />,
          path: 'emergencies'
        },
        { 
          text: 'Patients',
          icon: <PatientIcon />,
          path: 'patients'
        },
        { 
          text: 'Staff',
          icon: <PeopleIcon />,
          path: 'staff'
        },
      ]
    },
    {
      category: "Analytics",
      items: [
        { 
          text: 'Analytics',
          icon: <AnalyticsIcon />,
          path: 'analytics'
        },
        { 
          text: 'Map',
          icon: <MapIcon />,
          path: 'map'
        },
      ]
    },
    {
      category: "System",
      items: [
        { 
          text: 'Monitoring',
          icon: <MonitorHeartOutlined />,
          path: 'monitoring'
        },
        { 
          text: 'Support',
          icon: <SupportIcon />,
          path: 'support'
        },
        { 
          text: 'Settings',
          icon: <SettingsIcon />,
          path: 'settings'
        },
      ]
    }
  ];

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New patient admission in Emergency', time: '5 minutes ago', read: false },
    { id: 2, message: 'Dr. Smith requested equipment maintenance', time: '1 hour ago', read: false },
    { id: 3, message: 'System update available', time: '3 hours ago', read: true },
    { id: 4, message: 'Staff meeting at 3:00 PM today', time: 'Yesterday', read: true },
  ]);

  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const drawer = (
    <Box>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2.5,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.02)})`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component={motion.div}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7 }}
            sx={{ 
              mr: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderRadius: '12px',
              p: 1,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
            }}
          >
            <LocalHospital sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            MediSync
          </Typography>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ 
        p: 2.5,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: alpha(theme.palette.background.paper, 0.5),
      }}>
        <Box
          component={motion.div}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            position: 'relative',
          }}
        >
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            }}
            alt={user?.name || "User"}
            src={user?.avatar || "/avatar.jpg"}
          >
            {user?.name ? user.name.charAt(0) : "U"}
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.palette.success.main,
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{user?.name || "User"}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.success.main,
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Online • {user?.role || "User"}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <List sx={{ pt: 1 }}>
        {menuItems.map((category) => (
          <Box 
            key={category.category}
            sx={{ 
              mb: 2,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: -16,
                right: -16,
                bottom: 0,
                background: 
                  category.category === 'Main' 
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.primary.light, 0.01)})`
                    : category.category === 'Analytics'
                      ? `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)}, ${alpha(theme.palette.info.light, 0.01)})`
                      : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.03)}, ${alpha(theme.palette.secondary.light, 0.01)})`,
                zIndex: -1,
                borderRadius: '0 16px 16px 0',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: category.category === 'Main' ? 'auto' : 0,
                bottom: category.category === 'Main' ? 0 : 'auto',
                right: -10,
                width: 20,
                height: 60,
                background: category.category === 'Main' 
                  ? `radial-gradient(circle at bottom right, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`
                  : category.category === 'Analytics'
                    ? `radial-gradient(circle at top right, ${alpha(theme.palette.info.main, 0.1)}, transparent 70%)`
                    : `radial-gradient(circle at center right, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 70%)`,
                borderRadius: '50%',
                zIndex: -1,
                opacity: 0.8,
              }
            }}
          >
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                px: 1.5, 
                py: 0.5, 
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.7rem',
                mt: 1.5,
                mb: 0.5,
                color: 
                  category.category === 'Main' 
                    ? theme.palette.primary.main
                    : category.category === 'Analytics'
                      ? theme.palette.info.main
                      : theme.palette.secondary.main,
              }}
            >
              {category.category === 'Main' && 
                <Box 
                  component={motion.div}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  sx={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: '50%', 
                    mr: 1, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})` 
                  }} 
                />
              }
              {category.category === 'Analytics' && 
                <Box 
                  component={motion.div}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  sx={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: '50%', 
                    mr: 1, 
                    background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.light})` 
                  }} 
                />
              }
              {category.category === 'System' && 
                <Box 
                  component={motion.div}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  sx={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: '50%', 
                    mr: 1, 
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})` 
                  }} 
                />
              }
              {category.category}
            </Typography>
            {category.items.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    py: 1.25,
                    mx: 1,
                    my: 0.5,
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    color: location.pathname === `/${item.path}` ? 'primary.main' : 'text.primary',
                    backgroundColor: location.pathname === `/${item.path}` ? 
                      alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&::before': location.pathname === `/${item.path}` ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: '60%',
                      borderRadius: 4,
                      backgroundColor: 'primary.main',
                    } : {},
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip 
                    title={item.text} 
                    placement="right" 
                    arrow
                    disableHoverListener={open || mobileOpen}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        ml: open ? 0 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname === `/${item.path}` ? 'primary.main' : 'text.secondary',
                        backgroundColor: location.pathname === `/${item.path}` 
                          ? (theme) => alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: (theme) => theme.transitions.create(['background-color', 'color', 'margin', 'transform'], {
                          duration: theme.transitions.duration.standard,
                        }),
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: (theme) => location.pathname === `/${item.path}` 
                            ? alpha(theme.palette.primary.main, 0.18)
                            : alpha(theme.palette.primary.main, 0.08),
                        }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      ml: 1.5,
                      display: open ? 'block' : 'none',
                      transition: (theme) => theme.transitions.create(['opacity', 'display'], {
                        duration: theme.transitions.duration.standard,
                      }),
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {category.category !== "System" && (
              <Divider sx={{ my: 1, opacity: 0.6 }} />
            )}
          </Box>
        ))}
      </List>

      <Box sx={{ 
        p: 2, 
        mt: 'auto',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: alpha(theme.palette.background.paper, 0.4),
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 1.5,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(10px)',
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.04)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {colorMode.systemPreference ? (
              <SettingsBrightnessIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 20 }} />
            ) : mode === 'dark' ? (
              <DarkModeIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 20 }} />
            ) : (
              <LightModeIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 20 }} />
            )}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {colorMode.systemPreference 
                  ? "System Theme" 
                  : mode === 'dark' 
                    ? "Dark Mode" 
                    : "Light Mode"
                }
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {colorMode.systemPreference 
                  ? "Using your system preference" 
                  : "Manual selection"
                }
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!colorMode.systemPreference && (
              <IconButton 
                size="small" 
                onClick={colorMode.toggleColorMode}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            )}
            <IconButton 
              size="small"
              onClick={colorMode.toggleSystemPreference}
              sx={{
                bgcolor: colorMode.systemPreference ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: colorMode.systemPreference ? theme.palette.primary.main : theme.palette.text.secondary,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': {
                  bgcolor: colorMode.systemPreference 
                    ? alpha(theme.palette.primary.main, 0.2) 
                    : alpha(theme.palette.common.black, 0.05),
                },
              }}
            >
              <SettingsBrightnessIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mt: 2,
            opacity: 0.7,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            MediSync v1.0.0 &copy; 2023
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <StyledAppBar position="fixed" open={open}>
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pr: { xs: 1, sm: 2 },
          pl: { xs: 1, sm: 2 },
          minHeight: { xs: '56px', sm: '64px' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: { xs: 1, sm: 2 }, 
                display: { md: 'none' },
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ 
                  background: `linear-gradient(90deg, ${theme.palette.common.white}, ${alpha(theme.palette.common.white, 0.8)})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                MediSync
              </Typography>
              
              <Box 
                component={motion.div}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  ml: 2, 
                  background: alpha(theme.palette.common.white, 0.15),
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '50px',
                }}
              >
                <AccessTimeIcon sx={{ color: theme.palette.common.white, fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 500 }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Search Dialog */}
            <GlobalSearch 
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
            />

            {/* Notification Icon */}
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              aria-label="Notifications"
              size={isMobile ? "small" : "medium"}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationsMenu}
              open={Boolean(notificationsMenu)}
              onClose={handleNotificationsClose}
              sx={{ mt: 2 }}
              PaperProps={{
                sx: {
                  width: { xs: 280, sm: 320 },
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    // Mark all as read logic here
                    setNotifications(prev => 
                      prev.map(notif => ({ ...notif, read: true }))
                    );
                    handleNotificationsClose();
                  }}
                >
                  Mark all as read
                </Button>
              </Box>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No notifications</Typography>
                  </Box>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem 
                      key={notification.id}
                      onClick={handleNotificationsClose}
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderLeft: 3,
                        borderColor: notification.read ? 'transparent' : 'primary.main',
                        bgcolor: notification.read ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.05)
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: notification.read ? 400 : 600,
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: { mt: 0.5 }
                        }}
                      />
                    </MenuItem>
                  ))
                )}
              </Box>
              <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Button 
                  fullWidth
                  size="small"
                  onClick={() => {
                    // View all notifications logic
                    handleNotificationsClose();
                  }}
                >
                  View All Notifications
                </Button>
              </Box>
            </Menu>
            
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton 
                color="inherit" 
                onClick={colorMode.toggleColorMode}
                sx={{ 
                  color: theme.palette.common.white,
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                  },
                  ml: 1,
                }}
                size={isMobile ? "small" : "medium"}
              >
                {mode === 'dark' ? <LightModeIcon fontSize={isMobile ? "small" : "medium"} /> : <DarkModeIcon fontSize={isMobile ? "small" : "medium"} />}
              </IconButton>
            </Tooltip>
            
            {/* User profile button */}
            <IconButton
              onClick={handleAccountMenuOpen}
              sx={{ 
                ml: 2,
                border: 2,
                borderColor: alpha(theme.palette.common.white, 0.3),
                p: 0.5 
              }}
              aria-label="Account menu"
            >
              <Avatar 
                src={user?.avatar || "/avatar.jpg"}
                alt={user?.name || "User"} 
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 } 
        }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: mode === 'light' 
                ? theme.palette.background.paper 
                : theme.palette.grey[900],
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.05)}`,
            },
          }}
        >
          {drawer}
        </StyledDrawer>
        
        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: open ? drawerWidth : 72,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              boxSizing: 'border-box',
              overflowX: 'hidden',
              background: mode === 'light' 
                ? theme.palette.background.paper 
                : theme.palette.grey[900],
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.05)}`,
            },
          }}
          open={open}
        >
          {drawer}
        </StyledDrawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 9, sm: 10, md: 11 },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.6)}, ${alpha(theme.palette.background.default, 0)})`,
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            height: 'auto',
            minHeight: 'calc(100% - 20px)',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 1,
            overflowX: 'hidden',
            overflowY: 'visible',
          }}
        >
          <PageHeader />
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          }>
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                minHeight: 'calc(100% - 60px)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '20%',
                  right: 0,
                  width: '40%',
                  height: '60%',
                  background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.light, 0.05)}, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: 0,
                  opacity: 0.6,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '10%',
                  left: '5%',
                  width: '30%',
                  height: '40%',
                  background: `radial-gradient(circle at bottom left, ${alpha(theme.palette.secondary.light, 0.05)}, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: 0,
                  opacity: 0.4,
                },
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                sx={{ 
                  height: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  overflow: 'visible',
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </Suspense>
        </Container>
      </Box>

      {/* Account Menu */}
      <Menu
        anchorEl={accountMenu}
        open={Boolean(accountMenu)}
        onClose={handleAccountMenuClose}
        sx={{ mt: 2 }}
        PaperProps={{
          sx: {
            width: { xs: 240, sm: 260 },
            borderRadius: 2,
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar 
            src={user?.avatar || "/avatar.jpg"}
            alt={user?.name || "User"} 
            sx={{ 
              width: 64, 
              height: 64, 
              mx: 'auto',
              mb: 1,
              border: 3,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.2)
            }}
          />
          <Typography variant="subtitle1" fontWeight={600}>{user?.name || "User"}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{user?.role || "User"}</Typography>
          <Chip 
            label="Premium Account" 
            size="small" 
            color="primary" 
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <Divider />
        <List sx={{ p: 1 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountMenuClose} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountMenuClose} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Account Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountMenuClose} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 1 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout} 
              sx={{ 
                borderRadius: 1,
                color: 'error.main'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Menu>
    </Box>
  );
}

// PageHeader component to display the current page title and breadcrumbs
interface Breadcrumb {
  label: string;
  path: string;
  active?: boolean;
  icon?: React.ReactNode;
}

const PageHeader = () => {
  const location = useLocation();
  const theme = useTheme();
  
  // Generate page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Remove leading slash and split by '/'
    const segments = path.substring(1).split('/');
    
    if (segments[0] === '') return 'Dashboard';
    
    // Get the first segment and capitalize
    const firstSegment = segments[0];
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
  };
  
  // Generate breadcrumbs based on current route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.substring(1).split('/');
    
    let currentPath = '';
    const breadcrumbs: Breadcrumb[] = [];
    
    // Add Home as first element
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      icon: <HomeIcon sx={{ fontSize: 15, mr: 0.5 }} />
    });
    
    // Add each path segment
    segments.forEach((segment, index) => {
      if (segment !== '') {
        currentPath += `/${segment}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        breadcrumbs.push({
          label,
          path: currentPath,
          active: index === segments.length - 1 && segments[0] !== ''
        });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  const pageTitle = getPageTitle();
  
  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ 
        mb: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 0.5, overflowX: 'auto', py: 0.5 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ color: 'text.secondary', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Box 
              key={index} 
              component={crumb.active ? 'span' : Link} 
              to={crumb.active ? undefined : crumb.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: crumb.active ? 'text.primary' : 'text.secondary',
                textDecoration: 'none',
                fontWeight: crumb.active ? 500 : 400,
                '&:hover': {
                  color: crumb.active ? 'text.primary' : 'primary.main',
                  textDecoration: 'none',
                },
              }}
            >
              {crumb.icon && crumb.icon}
              {crumb.label}
            </Box>
          ))}
        </Breadcrumbs>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'text.primary', 
            fontWeight: 700, 
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          {pageTitle}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'center',
          mt: { xs: 1, sm: 0 }
        }}>
          <Box 
            sx={{ 
              height: '30px', 
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: '20px',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: { xs: '100%', sm: '200px', md: '300px' }
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 500, 
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 