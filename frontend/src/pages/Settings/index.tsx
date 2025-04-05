import { useState } from 'react';
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
} from '@mui/icons-material';

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
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('en');
  const [volume, setVolume] = useState(80);
  const [profile, setProfile] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@medisync.com',
    phone: '+1 (555) 123-4567',
    hospital: 'Central Medical Center',
    role: 'Emergency Physician',
  });

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
    // Implement settings save logic
  };

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
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Hospital"
                        value={profile.hospital}
                        onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Role"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Email Notifications"
                            secondary="Receive updates and alerts via email"
                          />
                          <Switch
                            checked={notifications.email}
                            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NotificationsIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Push Notifications"
                            secondary="Receive instant alerts on your device"
                          />
                          <Switch
                            checked={notifications.push}
                            onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="SMS Notifications"
                            secondary="Receive text message alerts"
                          />
                          <Switch
                            checked={notifications.sms}
                            onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Security Settings</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <SecurityIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Two-Factor Authentication"
                            secondary="Add an extra layer of security to your account"
                          />
                          <Button variant="outlined" color="primary">
                            Enable
                          </Button>
                        </ListItem>
                        <Divider sx={{ my: 2 }} />
                        <ListItem>
                          <ListItemText
                            primary="Password"
                            secondary="Last changed 30 days ago"
                          />
                          <Button variant="outlined">
                            Change Password
                          </Button>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Appearance Settings</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                          </ListItemIcon>
                          <ListItemText
                            primary="Dark Mode"
                            secondary="Toggle between light and dark theme"
                          />
                          <Switch
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LanguageIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Language"
                            secondary="Choose your preferred language"
                          />
                          <TextField
                            select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            sx={{ minWidth: 150 }}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                          </TextField>
                        </ListItem>
                      </List>
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