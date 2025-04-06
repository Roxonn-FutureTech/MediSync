import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  Avatar,
  Badge,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  ListSubheader,
  alpha,
  Menu,
  MenuItem,
  InputBase,
  Stack,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalHospital as HospitalIcon,
  LocalHospital,
  Warning as EmergencyIcon,
  People as StaffIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  Person as PatientIcon,
  Message as MessageIcon,
  Logout as LogoutIcon,
  Analytics as AnalyticsIcon,
  Map as MapIcon,
  Medication as MedicationIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';
import { styled } from '@mui/material/styles';

const DRAWER_WIDTH = 260;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.text.primary, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: '0 0 0 2px ' + theme.palette.background.paper,
    fontWeight: 'bold',
    padding: '0 4px',
  },
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const mainNavItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { name: 'Hospitals', icon: <HospitalIcon />, path: '/hospitals' },
  { name: 'Emergencies', icon: <EmergencyIcon />, path: '/emergencies' },
  { name: 'Staff', icon: <StaffIcon />, path: '/staff' },
  { name: 'Patients', icon: <PatientIcon />, path: '/patients' },
];

const analyticsNavItems = [
  { name: 'Statistics', icon: <AnalyticsIcon />, path: '/analytics' },
  { name: 'Maps', icon: <MapIcon />, path: '/maps' },
];

const Layout = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  
  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const isProfileOpen = Boolean(profileAnchorEl);

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const mockNotifications = [
    { id: 1, content: 'Emergency alert from Central Hospital', time: '5 min ago' },
    { id: 2, content: 'Dr. Smith updated the patient record', time: '30 min ago' },
    { id: 3, content: 'New critical patient admitted', time: '2 hours ago' },
  ];

  const drawerContent = (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: 2.5,
        borderBottom: 1,
        borderColor: 'divider',
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" color="primary" fontWeight="bold">
            MediSync
          </Typography>
        </Box>
        {isMobile && (
          <AnimatedIconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </AnimatedIconButton>
        )}
      </Box>
      
      <Box sx={{ 
        p: 2.5, 
        borderBottom: 1, 
        borderColor: 'divider',
        background: (theme) => alpha(theme.palette.background.paper, 0.6),
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            alt="Admin User"
            src="/assets/avatar.jpg"
            sx={{ 
              width: 50, 
              height: 50,
              border: (theme) => `2px solid ${theme.palette.primary.main}`,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)'
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Dr. Jane Doe</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <HospitalIcon sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} /> Emergency Admin
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      <Divider />

      <List sx={{ p: 1.5 }}>
        {mainNavItems.map((item) => {
          const isActive = 
            (item.path === '/' && location.pathname === '/') || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                  boxShadow: isActive ? '0 4px 8px rgba(0, 0, 0, 0.05)' : 'none',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? alpha(theme.palette.primary.main, 0.2) 
                      : alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    minWidth: 45,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
                {isActive && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 20, 
                      borderRadius: 4, 
                      backgroundColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <List 
        subheader={
          <ListSubheader 
            sx={{ 
              bgcolor: 'transparent', 
              color: 'text.secondary', 
              fontWeight: 700, 
              fontSize: '0.8rem', 
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              pl: 3
            }}
          >
            Analytics
          </ListSubheader>
        }
        sx={{ p: 1.5 }}
      >
        {analyticsNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                  boxShadow: isActive ? '0 4px 8px rgba(0, 0, 0, 0.05)' : 'none',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? alpha(theme.palette.primary.main, 0.2) 
                      : alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    minWidth: 45,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
                {isActive && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 20, 
                      borderRadius: 4, 
                      backgroundColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <List>
          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              onClick={() => navigate('/settings')}
              sx={{
                borderRadius: 2,
                py: 1.2,
                backgroundColor: location.pathname === '/settings' 
                  ? alpha(theme.palette.primary.main, 0.15) 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === '/settings' 
                    ? alpha(theme.palette.primary.main, 0.2) 
                    : alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === '/settings' ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/support')}
              sx={{ 
                borderRadius: 2,
                py: 1.2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Support" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar 
        position="fixed" 
        color="default"
        elevation={0}
        sx={{
          width: { md: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: drawerOpen ? `${DRAWER_WIDTH}px` : 0 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <AnimatedIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </AnimatedIconButton>
          
          {isMobile && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              MediSync
            </Typography>
          )}
          
          <Search sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Change theme" arrow>
              <AnimatedIconButton 
                onClick={toggleColorMode} 
                color="inherit"
                size="medium"
                sx={{ 
                  mr: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </AnimatedIconButton>
            </Tooltip>
            
            <Tooltip title="Messages" arrow>
              <AnimatedIconButton 
                color="inherit" 
                sx={{ 
                  mr: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                <StyledBadge badgeContent={4} color="error">
                  <MessageIcon />
                </StyledBadge>
              </AnimatedIconButton>
            </Tooltip>
            
            <Tooltip title="Notifications" arrow>
              <AnimatedIconButton
                color="inherit"
                onClick={handleNotificationsClick}
                sx={{ 
                  mr: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                <StyledBadge badgeContent={3} color="error">
                  <NotificationsIcon />
                </StyledBadge>
              </AnimatedIconButton>
            </Tooltip>
            
            <Tooltip title="Account settings" arrow>
              <AnimatedIconButton
                onClick={handleProfileClick}
                size="small"
                aria-controls={isProfileOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isProfileOpen ? 'true' : undefined}
                color="inherit"
                sx={{ 
                  ml: 0.5,
                  border: 2,
                  borderColor: 'transparent',
                  '&:hover': {
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 34, 
                    height: 34,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  alt="Admin User"
                  src="/assets/avatar.jpg"
                />
              </AnimatedIconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerOpen ? DRAWER_WIDTH : 0 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
              background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${theme.palette.background.paper} 100%)`,
            },
            display: { xs: drawerOpen ? 'block' : 'none', md: 'block' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { md: drawerOpen ? `${DRAWER_WIDTH}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          height: '100%',
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed app bar */}
        <Box sx={{ 
          p: { xs: 2.5, md: 3.5 }, 
          height: 'calc(100% - 64px)',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            },
          }
        }}>
          <Outlet />
        </Box>
      </Box>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        open={isNotificationsOpen}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            maxHeight: 420,
            width: 340,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.12))',
            mt: 1.5,
            borderRadius: 3,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
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
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Notifications</Typography>
          <Chip 
            label="3 new" 
            size="small" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          />
        </Box>
        <List sx={{ p: 0 }}>
          {mockNotifications.map((notification, index) => (
            <MenuItem 
              key={notification.id}
              onClick={handleNotificationsClose}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                px: 2, 
                py: 1.8,
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                },
                animation: 'fadeIn 0.3s ease-in-out',
                animationDelay: `${index * 0.1}s`,
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(8px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  },
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                    color: 'primary.main', 
                    width: 40, 
                    height: 40,
                    mr: 2,
                  }}
                >
                  {index === 0 && <EmergencyIcon color="error" />}
                  {index === 1 && <HospitalIcon color="primary" />}
                  {index === 2 && <PatientIcon color="info" />}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{notification.content}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <GradientButton size="small" fullWidth>
            View all notifications
          </GradientButton>
        </Box>
      </Menu>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        id="account-menu"
        open={isProfileOpen}
        onClose={handleProfileClose}
        onClick={handleProfileClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.12))',
            mt: 1.5,
            width: 250,
            borderRadius: 3,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
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
              borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderLeft: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.2)})`,
        }}>
          <Avatar
            alt="Admin User"
            src="/assets/avatar.jpg"
            sx={{ 
              width: 70, 
              height: 70, 
              mb: 1.5,
              border: (theme) => `3px solid ${theme.palette.background.paper}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          />
          <Typography variant="h6" fontWeight="bold">Dr. Jane Doe</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>jane.doe@medisync.com</Typography>
          <Chip 
            label="Emergency Admin" 
            size="small" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.7rem',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          />
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>My Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Account Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileClose} sx={{ 
          mt: 1,
          mb: 1,
          mx: 2,
          borderRadius: 2,
          py: 1.5,
          backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
          color: 'error.main',
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.15),
          },
        }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 