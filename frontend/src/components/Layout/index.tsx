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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalHospital,
  Warning as Emergency,
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Hospitals', icon: <LocalHospital />, path: '/hospitals' },
  { text: 'Emergencies', icon: <Emergency />, path: '/emergencies' },
  { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
  { text: 'Staff', icon: <People />, path: '/staff' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Layout = () => {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerVariants = {
    open: {
      width: drawerWidth,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      width: isMobile ? 0 : 72,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    open: {
      marginLeft: isMobile ? 0 : drawerWidth,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      marginLeft: isMobile ? 0 : 72,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 72}px)` },
          ml: { md: `${drawerOpen ? drawerWidth : 72}px` },
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(muiTheme.palette.background.default, 0.7),
          borderBottom: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={toggleTheme} 
              sx={{ 
                mr: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton 
              sx={{ 
                mr: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Badge 
                badgeContent={4} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                      '50%': {
                        transform: 'scale(1.2)',
                        opacity: 0.8,
                      },
                      '100%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                    },
                  },
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                padding: 0.5,
                border: `2px solid ${muiTheme.palette.primary.main}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          component: motion.div,
          variants: drawerVariants,
          animate: drawerOpen ? 'open' : 'closed',
          sx: {
            backgroundColor: muiTheme.palette.mode === 'dark' 
              ? alpha(muiTheme.palette.background.paper, 0.8) 
              : muiTheme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            overflow: 'hidden',
            height: '100%',
            position: 'fixed',
          },
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: `linear-gradient(45deg, ${alpha(muiTheme.palette.primary.main, 0.1)}, ${alpha(muiTheme.palette.secondary.main, 0.1)})`,
          }}
        >
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  MediSync
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                      transform: 'translateX(6px)',
                    },
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 3,
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: muiTheme.palette.primary.main,
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <AnimatePresence>
                    {drawerOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemText 
                          primary={item.text}
                          sx={{
                            color: isActive ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component={motion.div}
        variants={contentVariants}
        animate={drawerOpen ? 'open' : 'closed'}
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          pt: { xs: 8, sm: 9 },
          px: 3,
          pb: 3,
          transition: 'all 0.3s ease',
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.background.default, 0.9)} 0%, ${alpha(muiTheme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(10px)',
          marginLeft: { md: `${drawerOpen ? drawerWidth : 72}px` },
          width: {
            xs: '100%',
            md: `calc(100% - ${drawerOpen ? drawerWidth : 72}px)`,
          },
        }}
      >
        <Outlet />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 200,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                transform: 'translateX(6px)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ opacity: 0.1 }} />
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 