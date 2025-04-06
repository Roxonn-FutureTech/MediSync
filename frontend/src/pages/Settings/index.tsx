import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Chip,
  Container,
  Paper,
  Avatar,
  InputAdornment,
  Tooltip,
  CardContent,
  Select,
  SelectChangeEvent,
  Checkbox,
  Slider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  VolumeUp as VolumeUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Notifications,
  AccessTime as AccessTimeIcon,
  ColorLens as ColorLensIcon,
  Check as CheckIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Accessibility as AccessibilityIcon,
  MonitorHeart as MonitorHeartIcon,
  Tune as TuneIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
  Campaign as CampaignIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const theme = useTheme();
  const { 
    darkMode, 
    setDarkMode, 
    isSystemTheme, 
    toggleSystemTheme, 
    reduceMotion, 
    setReduceMotion,
    accentColor,
    setAccentColor
  } = useThemeContext();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('en');
  const [volume, setVolume] = useState(80);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '(555) 123-4567',
    title: 'Doctor',
    department: 'Cardiology',
    bio: 'Experienced cardiologist specializing in preventative care and heart disease management.'
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [animationSpeed, setAnimationSpeed] = useState(1);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to an API
    showNotification({
      message: 'Settings saved successfully!',
      type: 'success'
    });
    
    // Save theme settings
    localStorage.setItem('medisync-dark-mode', darkMode.toString());
    localStorage.setItem('medisync-language', language);
    localStorage.setItem('medisync-font-size', fontSize);
    localStorage.setItem('medisync-font-family', fontFamily);
    localStorage.setItem('medisync-reduce-motion', reduceMotion.toString());
    
    // This effect would be handled by context in a real app
    document.documentElement.style.setProperty('--animation-speed', `${animationSpeed}s`);
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setDarkMode(false);
    setLanguage('en');
    setFontSize('medium');
    setFontFamily('Inter');
    setTimeFormat('12h');
    setReduceMotion(false);
    setAnimationSpeed(1);
    setAccentColor('#2196f3');

    showNotification({
      message: 'Settings reset to defaults',
      type: 'info'
    });
  };

  // Load saved settings on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('medisync-language');
    if (savedLanguage) setLanguage(savedLanguage);
    
    const savedFontSize = localStorage.getItem('medisync-font-size');
    if (savedFontSize) setFontSize(savedFontSize);
    
    const savedFontFamily = localStorage.getItem('medisync-font-family');
    if (savedFontFamily) setFontFamily(savedFontFamily);
    
    const savedReduceMotion = localStorage.getItem('medisync-reduce-motion');
    if (savedReduceMotion) setReduceMotion(savedReduceMotion === 'true');
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Settings
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 2 }}>
                <List>
                  <ListItem button selected={activeTab === 0} onClick={() => setActiveTab(0)}>
                    <ListItemIcon>
                      <PersonIcon color={activeTab === 0 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem button selected={activeTab === 1} onClick={() => setActiveTab(1)}>
                    <ListItemIcon>
                      <NotificationsIcon color={activeTab === 1 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItem>
                  <ListItem button selected={activeTab === 2} onClick={() => setActiveTab(2)}>
                    <ListItemIcon>
                      <SecurityIcon color={activeTab === 2 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Security" />
                  </ListItem>
                  <ListItem button selected={activeTab === 3} onClick={() => setActiveTab(3)}>
                    <ListItemIcon>
                      <PaletteIcon color={activeTab === 3 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Appearance" />
                  </ListItem>
                </List>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={9}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <TabPanel value={activeTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Profile Information</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        Notification Preferences
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Control how and when you receive alerts and updates within MediSync.
                      </Typography>
                    </Grid>
                    
                    {/* Notification Channels */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Notification Channels</Typography>
                          </Box>
                          
                          <List disablePadding>
                            <ListItem sx={{ px: 1 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                    <Typography variant="subtitle2">Email Notifications</Typography>
                                  </Box>
                                }
                                secondary="Receive updates and alerts via email"
                              />
                              <Switch
                                checked={notifications.email}
                                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                color="primary"
                              />
                            </ListItem>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem sx={{ px: 1 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <NotificationsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                    <Typography variant="subtitle2">Push Notifications</Typography>
                                  </Box>
                                }
                                secondary="Receive instant alerts on your device"
                              />
                              <Switch
                                checked={notifications.push}
                                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                color="primary"
                              />
                            </ListItem>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem sx={{ px: 1 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                    <Typography variant="subtitle2">SMS Notifications</Typography>
                                  </Box>
                                }
                                secondary="Receive text message alerts"
                              />
                              <Switch
                                checked={notifications.sms}
                                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                                color="primary"
                              />
                            </ListItem>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem sx={{ px: 1 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CampaignIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                    <Typography variant="subtitle2">Marketing Emails</Typography>
                                  </Box>
                                }
                                secondary="Receive newsletters and promotional emails"
                              />
                              <Switch
                                checked={marketingEmails}
                                onChange={(e) => setMarketingEmails(e.target.checked)}
                                color="primary"
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Notification Categories */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CategoryIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Notification Categories</Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select which types of notifications you'd like to receive
                          </Typography>
                          
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                              <Box>
                                <Typography variant="subtitle2">Patient Updates</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  New patient registrations and updates to patient information
                                </Typography>
                              </Box>
                            }
                            sx={{ display: 'flex', my: 1 }}
                          />
                          
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                              <Box>
                                <Typography variant="subtitle2">Emergency Alerts</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  High-priority emergency notifications requiring immediate attention
                                </Typography>
                              </Box>
                            }
                            sx={{ display: 'flex', my: 1 }}
                          />
                          
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                              <Box>
                                <Typography variant="subtitle2">Appointment Reminders</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Upcoming appointment alerts and schedule changes
                                </Typography>
                              </Box>
                            }
                            sx={{ display: 'flex', my: 1 }}
                          />
                          
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                              <Box>
                                <Typography variant="subtitle2">System Updates</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Information about system maintenance and new features
                                </Typography>
                              </Box>
                            }
                            sx={{ display: 'flex', my: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Sound & Display */}
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TuneIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Sound & Display</Typography>
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" gutterBottom>Notification Sound</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
                                <VolumeUpIcon sx={{ color: 'text.secondary', mr: 2 }} />
                                <Slider
                                  value={volume}
                                  onChange={(e, newValue) => setVolume(newValue as number)}
                                  aria-labelledby="notification-volume-slider"
                                  valueLabelDisplay="auto"
                                  step={10}
                                  marks
                                  min={0}
                                  max={100}
                                  sx={{ flex: 1 }}
                                />
                                <Box sx={{ ml: 2, minWidth: 45 }}>
                                  <Typography variant="body2" color="text.secondary">{volume}%</Typography>
                                </Box>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" gutterBottom>Sound Theme</Typography>
                                <Select
                                  value="default"
                                  size="small"
                                  fullWidth
                                >
                                  <MenuItem value="default">Standard Alerts</MenuItem>
                                  <MenuItem value="gentle">Gentle Notifications</MenuItem>
                                  <MenuItem value="urgent">Urgent Alerts</MenuItem>
                                  <MenuItem value="muted">Muted (Vibration only)</MenuItem>
                                </Select>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" gutterBottom>Display Options</Typography>
                              <List disablePadding>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemText
                                    primary="Group Similar Notifications"
                                    secondary="Combine multiple notifications from the same source"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemText
                                    primary="Show Preview"
                                    secondary="Display notification contents on lock screen"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemText
                                    primary="Notification Banner Style"
                                  />
                                  <Select
                                    value="persistent"
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    <MenuItem value="persistent">Persistent</MenuItem>
                                    <MenuItem value="temporary">Temporary</MenuItem>
                                    <MenuItem value="minimized">Minimized</MenuItem>
                                  </Select>
                                </ListItem>
                              </List>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Notification Preview */}
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PreviewIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Notification Preview</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                              sx={{
                                maxWidth: 380,
                                width: '100%',
                                p: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  borderRadius: 2,
                                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                                  overflow: 'hidden',
                                  backgroundColor: theme.palette.background.paper,
                                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  p: 2,
                                  gap: 1.5,
                                }}
                              >
                                <Avatar 
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    width: 40,
                                    height: 40,
                                    '& svg': {
                                      fontSize: '1.5rem',
                                      color: theme.palette.primary.main
                                    }
                                  }}
                                >
                                  <NotificationsIcon />
                                </Avatar>
                                
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                                    New Patient Registration
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    Sarah Thompson has completed registration and is awaiting approval
                                  </Typography>
                                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </Typography>
                                </Box>
                                
                                <IconButton 
                                  size="small"
                                  sx={{ 
                                    color: theme.palette.text.secondary,
                                    position: 'absolute',
                                    top: 8,
                                    right: 8
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              onClick={() => {
                                console.log("Test notification button clicked");
                                try {
                                  showNotification({
                                    title: 'Test Notification',
                                    message: 'This is a preview of how your notifications will appear',
                                    type: 'info'
                                  });
                                  console.log("Notification created successfully");
                                } catch (error) {
                                  console.error("Error creating notification:", error);
                                }
                              }}
                              startIcon={<NotificationsIcon />}
                            >
                              Test Notification
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleSaveSettings}
                        startIcon={<SaveIcon />}
                      >
                        Save Notification Settings
                      </Button>
                      
                      <Button 
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetSettings}
                      >
                        Reset to Defaults
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        Performance & Optimization
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Optimize MediSync to work efficiently on your device and network conditions.
                      </Typography>
                    </Grid>
                    
                    {/* Data Usage */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <StorageIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Data Usage</Typography>
                          </Box>
                          
                          <List disablePadding>
                            <ListItem>
                              <ListItemText
                                primary="Data Saver Mode"
                                secondary="Reduce data usage by loading lower quality images and minimizing background syncing"
                              />
                              <Switch />
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                              <ListItemText
                                primary="Background Data Sync"
                                secondary="Allow the app to sync data in the background"
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                              <ListItemText
                                primary="Offline Mode"
                                secondary="Enable essential functionality when offline"
                              />
                              <Switch defaultChecked />
                            </ListItem>
                          </List>
                          
                          <Box sx={{ mt: 3, p: 2, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Estimated Data Usage
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">This month:</Typography>
                              <Typography variant="body2" fontWeight="bold">24.7 MB</Typography>
                            </Box>
                            <Box sx={{ mt: 1, mb: 1, height: 6, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3 }}>
                              <Box sx={{ 
                                width: '35%', 
                                height: '100%', 
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 3 
                              }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              35% of your 100 MB monthly limit
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Performance Options */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <SpeedIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Performance</Typography>
                          </Box>
                          
                          <List disablePadding>
                            <ListItem>
                              <ListItemText
                                primary="Hardware Acceleration"
                                secondary="Use your device's GPU to improve performance"
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                              <ListItemText
                                primary="Smart Loading"
                                secondary="Load content progressively to speed up initial page load"
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                              <ListItemText
                                primary="Cache Limit"
                                secondary="Maximum space used for storing offline data"
                              />
                              <Select
                                value="500"
                                size="small"
                                sx={{ minWidth: 120 }}
                              >
                                <MenuItem value="100">100 MB</MenuItem>
                                <MenuItem value="250">250 MB</MenuItem>
                                <MenuItem value="500">500 MB</MenuItem>
                                <MenuItem value="1000">1 GB</MenuItem>
                              </Select>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Accessibility Features */}
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessibilityIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Accessibility</Typography>
                          </Box>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <List disablePadding>
                                <ListItem>
                                  <ListItemText
                                    primary="Screen Reader Support"
                                    secondary="Optimize for compatibility with screen readers"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <Divider sx={{ my: 1 }} />
                                <ListItem>
                                  <ListItemText
                                    primary="High Contrast Mode"
                                    secondary="Increase contrast for better visibility"
                                  />
                                  <Switch />
                                </ListItem>
                              </List>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <List disablePadding>
                                <ListItem>
                                  <ListItemText
                                    primary="Keyboard Navigation"
                                    secondary="Enhanced keyboard shortcuts for navigation"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <Divider sx={{ my: 1 }} />
                                <ListItem>
                                  <ListItemText
                                    primary="Text-to-Speech"
                                    secondary="Read text content aloud"
                                  />
                                  <Switch />
                                </ListItem>
                              </List>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Performance Monitoring */}
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MonitorHeartIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Performance Monitoring</Typography>
                          </Box>
                          
                          <Box sx={{ p: 2, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                            <Typography variant="subtitle2" gutterBottom>
                              System Health
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Response Time
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mt: 1
                                  }}>
                                    <Box sx={{ 
                                      width: 48, 
                                      height: 48, 
                                      borderRadius: '50%', 
                                      bgcolor: alpha(theme.palette.success.main, 0.1),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: theme.palette.success.main,
                                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                    }}>
                                      <Typography variant="subtitle2">45ms</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Memory Usage
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mt: 1
                                  }}>
                                    <Box sx={{ 
                                      width: 48, 
                                      height: 48, 
                                      borderRadius: '50%', 
                                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: theme.palette.warning.main,
                                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                                    }}>
                                      <Typography variant="subtitle2">68%</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    CPU Load
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mt: 1
                                  }}>
                                    <Box sx={{ 
                                      width: 48, 
                                      height: 48, 
                                      borderRadius: '50%', 
                                      bgcolor: alpha(theme.palette.info.main, 0.1),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: theme.palette.info.main,
                                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                    }}>
                                      <Typography variant="subtitle2">23%</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                            
                            <Typography variant="subtitle2" gutterBottom>
                              Resource Trend (Last 24h)
                            </Typography>
                            
                            <Box sx={{ height: 80, mt: 2, position: 'relative' }}>
                              {/* Simplified chart mockup */}
                              <Box sx={{ 
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'flex-end'
                              }}>
                                {[15, 22, 19, 30, 25, 35, 29, 36, 30, 28, 33, 24].map((value, index) => (
                                  <Box 
                                    key={index}
                                    sx={{ 
                                      height: `${value}%`,
                                      width: '7%',
                                      mx: '0.5%',
                                      bgcolor: theme.palette.primary.main,
                                      opacity: 0.7 + (index / 40),
                                      borderTopLeftRadius: 2,
                                      borderTopRightRadius: 2
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleSaveSettings}
                        startIcon={<SaveIcon />}
                      >
                        Save Performance Settings
                      </Button>
                      
                      <Button 
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetSettings}
                      >
                        Reset to Defaults
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        Appearance & Theme
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Customize how MediSync looks and feels to match your preferences.
                      </Typography>
                    </Grid>
                    
                    {/* Theme Selection Cards */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        Theme Mode
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <Card 
                          sx={{
                            p: 2,
                            flex: '1 1 0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible',
                            border: !darkMode ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px -4px ${alpha(theme.palette.common.black, 0.1)}`
                            }
                          }}
                          onClick={() => setDarkMode(false)}
                        >
                          {!darkMode && (
                            <Chip 
                              size="small" 
                              color="primary" 
                              label="Active" 
                              sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: 10,
                              }}
                            />
                          )}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            color: !darkMode ? theme.palette.primary.main : 'inherit'
                          }}>
                            <LightModeIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Light Mode</Typography>
                          </Box>
                          <Box sx={{
                            height: 100,
                            mb: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(120deg, #ffffff 0%, #f5f5f5 100%)',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Box sx={{
                              width: '80%',
                              height: '70%',
                              borderRadius: 1,
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                              <Box sx={{ 
                                height: '20%', 
                                bg: '#2196f3', 
                                borderTopLeftRadius: 1,
                                borderTopRightRadius: 1,
                                mb: 1,
                                backgroundColor: '#2196f3'
                              }} />
                              <Box sx={{ 
                                display: 'flex', 
                                flex: 1,
                                gap: 1
                              }}>
                                <Box sx={{ width: '30%', backgroundColor: '#e0e0e0', borderRadius: 0.5 }} />
                                <Box sx={{ 
                                  width: '70%', 
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 0.5
                                }}>
                                  <Box sx={{ height: '30%', backgroundColor: '#f0f0f0', borderRadius: 0.5 }} />
                                  <Box sx={{ height: '30%', backgroundColor: '#f0f0f0', borderRadius: 0.5 }} />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Bright interface ideal for daytime use with high contrast visuals.
                          </Typography>
                        </Card>

                        <Card 
                          sx={{
                            p: 2,
                            flex: '1 1 0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible',
                            border: darkMode ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px -4px ${alpha(theme.palette.common.black, 0.2)}`
                            }
                          }}
                          onClick={() => setDarkMode(true)}
                        >
                          {darkMode && (
                            <Chip 
                              size="small" 
                              color="primary" 
                              label="Active" 
                              sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: 10,
                              }}
                            />
                          )}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            color: darkMode ? theme.palette.primary.main : 'inherit'
                          }}>
                            <DarkModeIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Dark Mode</Typography>
                          </Box>
                          <Box sx={{
                            height: 100,
                            mb: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(120deg, #121212 0%, #1e1e1e 100%)',
                            border: '1px solid #333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Box sx={{
                              width: '80%',
                              height: '70%',
                              borderRadius: 1,
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                              <Box sx={{ 
                                height: '20%', 
                                bg: '#2196f3', 
                                borderTopLeftRadius: 1,
                                borderTopRightRadius: 1,
                                mb: 1,
                                backgroundColor: '#1976d2'
                              }} />
                              <Box sx={{ 
                                display: 'flex', 
                                flex: 1,
                                gap: 1
                              }}>
                                <Box sx={{ width: '30%', backgroundColor: '#333', borderRadius: 0.5 }} />
                                <Box sx={{ 
                                  width: '70%', 
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 0.5
                                }}>
                                  <Box sx={{ height: '30%', backgroundColor: '#333', borderRadius: 0.5 }} />
                                  <Box sx={{ height: '30%', backgroundColor: '#333', borderRadius: 0.5 }} />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Reduced eye strain in low-light environments and extends battery life.
                          </Typography>
                        </Card>
                        
                        <Card 
                          sx={{
                            p: 2,
                            flex: '1 1 0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible',
                            border: isSystemTheme ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px -4px ${alpha(theme.palette.common.black, 0.2)}`
                            }
                          }}
                          onClick={() => toggleSystemTheme()}
                        >
                          {isSystemTheme && (
                            <Chip 
                              size="small" 
                              color="primary" 
                              label="Active" 
                              sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: 10,
                              }}
                            />
                          )}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            color: isSystemTheme ? theme.palette.primary.main : 'inherit'
                          }}>
                            <SettingsIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">System Theme</Typography>
                          </Box>
                          <Box sx={{
                            height: 100,
                            mb: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(120deg, #ffffff 0%, #f5f5f5 100%)',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Box sx={{
                              width: '80%',
                              height: '70%',
                              borderRadius: 1,
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                              <Box sx={{ 
                                height: '20%', 
                                bg: '#2196f3', 
                                borderTopLeftRadius: 1,
                                borderTopRightRadius: 1,
                                mb: 1,
                                backgroundColor: '#2196f3'
                              }} />
                              <Box sx={{ 
                                display: 'flex', 
                                flex: 1,
                                gap: 1
                              }}>
                                <Box sx={{ width: '30%', backgroundColor: '#e0e0e0', borderRadius: 0.5 }} />
                                <Box sx={{ 
                                  width: '70%', 
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 0.5
                                }}>
                                  <Box sx={{ height: '30%', backgroundColor: '#f0f0f0', borderRadius: 0.5 }} />
                                  <Box sx={{ height: '30%', backgroundColor: '#f0f0f0', borderRadius: 0.5 }} />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Follow system theme settings.
                          </Typography>
                        </Card>
                      </Box>
                    </Grid>

                    {/* Color Accent */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        Color Accent
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 2,
                          '& > *': {
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            bgcolor: '#2196f3', 
                            border: accentColor === '#2196f3' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#2196f3' ? '0 0 0 2px #2196f3' : 'none'
                          }}
                          onClick={() => setAccentColor('#2196f3')}
                        />
                        <Box 
                          sx={{ 
                            bgcolor: '#f50057',
                            border: accentColor === '#f50057' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#f50057' ? '0 0 0 2px #f50057' : 'none'
                          }}
                          onClick={() => setAccentColor('#f50057')}
                        />
                        <Box 
                          sx={{ 
                            bgcolor: '#4caf50',
                            border: accentColor === '#4caf50' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#4caf50' ? '0 0 0 2px #4caf50' : 'none'
                          }}
                          onClick={() => setAccentColor('#4caf50')}
                        />
                        <Box 
                          sx={{ 
                            bgcolor: '#ff9800',
                            border: accentColor === '#ff9800' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#ff9800' ? '0 0 0 2px #ff9800' : 'none'
                          }}
                          onClick={() => setAccentColor('#ff9800')}
                        />
                        <Box 
                          sx={{ 
                            bgcolor: '#9c27b0',
                            border: accentColor === '#9c27b0' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#9c27b0' ? '0 0 0 2px #9c27b0' : 'none'
                          }}
                          onClick={() => setAccentColor('#9c27b0')}
                        />
                        <Box 
                          sx={{ 
                            bgcolor: '#607d8b',
                            border: accentColor === '#607d8b' ? '2px solid #fff' : 'none',
                            boxShadow: accentColor === '#607d8b' ? '0 0 0 2px #607d8b' : 'none'
                          }}
                          onClick={() => setAccentColor('#607d8b')}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Settings;