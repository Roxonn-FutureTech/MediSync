import { useState, useContext } from 'react';
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
  CardContent,
  Radio,
  RadioGroup,
  Tooltip,
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
  DeviceHub as SystemIcon,
  Info as AboutIcon,
  Accessibility as AccessibilityIcon,
  DataUsage as DataIcon,
  CloudUpload as CloudIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';
import { ColorModeContext } from '../../contexts/ColorModeContext';

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
  const colorMode = useContext(ColorModeContext);
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
  const [activeSection, setActiveSection] = useState('theme');

  // Define sections
  const sections = [
    { id: 'theme', label: 'Theme', icon: <PaletteIcon /> },
    { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'language', label: 'Language', icon: <LanguageIcon /> },
    { id: 'accessibility', label: 'Accessibility', icon: <AccessibilityIcon /> },
    { id: 'data', label: 'Data & Storage', icon: <DataIcon /> },
    { id: 'about', label: 'About', icon: <AboutIcon /> },
  ];

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
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8} sx={{ pl: { xs: 5, md: 3 }, pt: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Customize your MediSync experience
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 1 }}>
                {sections.map((section) => (
                  <ListItem
                    button
                    key={section.id}
                    selected={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    component={motion.div}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      borderLeft: '3px solid',
                      borderLeftColor: activeSection === section.id 
                        ? theme.palette.primary.main 
                        : 'transparent',
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        }
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: activeSection === section.id 
                          ? theme.palette.primary.main 
                          : alpha(theme.palette.text.primary, 0.7)
                      }}
                    >
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={section.label}
                      primaryTypographyProps={{
                        fontWeight: activeSection === section.id ? 600 : 400,
                      }}
                    />
                    {section.id === 'theme' && (
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: theme.palette.primary.main,
                          ml: 1,
                        }} 
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Card 
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{ 
              borderRadius: 2, 
              boxShadow: theme.shadows[2], 
              minHeight: 500,
            }}
          >
            {activeSection === 'theme' && (
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <PaletteIcon sx={{ mr: 1 }} /> Theme Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customize the appearance of your MediSync application
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        p: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3 }}>Theme Mode</Typography>

                      <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={colorMode.systemPreference}
                              onChange={colorMode.toggleSystemPreference}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SystemIcon sx={{ mr: 1, fontSize: 18 }} />
                              <Typography>Use system theme</Typography>
                            </Box>
                          }
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 4.5 }}>
                          Automatically switch between light and dark mode based on your system preferences
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 3, mb: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                          Manual Selection
                        </Typography>
                        
                        <RadioGroup
                          value={colorMode.mode}
                          onChange={(e) => {
                            if (e.target.value === 'light' || e.target.value === 'dark') {
                              colorMode.toggleColorMode();
                            }
                          }}
                          sx={{ ml: 1 }}
                        >
                          <FormControlLabel 
                            value="light" 
                            control={<Radio />} 
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LightModeIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                                <Typography>Light Mode</Typography>
                              </Box>
                            } 
                            disabled={colorMode.systemPreference}
                          />
                          <FormControlLabel 
                            value="dark" 
                            control={<Radio />} 
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DarkModeIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                <Typography>Dark Mode</Typography>
                              </Box>
                            } 
                            disabled={colorMode.systemPreference}
                          />
                        </RadioGroup>
                      </Box>
                    </Card>

                    <Card
                      sx={{
                        p: 3,
                        mt: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2 }}>Animations</Typography>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable animations"
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 4.5 }}>
                        Motion animations and transitions throughout the interface
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        p: 3,
                        height: '100%',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2 }}>Preview</Typography>
                      
                      <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flexDirection: 'column',
                        p: 3,
                        borderRadius: 2,
                        bgcolor: theme.palette.background.default,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        minHeight: 300,
                      }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                          {colorMode.mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </Typography>
                        
                        <Box sx={{ 
                          width: '100%', 
                          maxWidth: 320,
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: theme.palette.background.paper,
                          border: '1px solid',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          boxShadow: theme.shadows[1],
                          mb: 2,
                        }}>
                          <Typography variant="body2" fontWeight={500}>Sample Card</Typography>
                          <Typography variant="caption" color="text.secondary">
                            This is how content will appear in {colorMode.mode} mode
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button 
                            size="small" 
                            color="primary" 
                            variant="contained"
                          >
                            Primary
                          </Button>
                          <Button 
                            size="small" 
                            color="secondary" 
                            variant="contained"
                          >
                            Secondary
                          </Button>
                          <Button 
                            size="small" 
                            color="error" 
                            variant="contained"
                          >
                            Alert
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mr: 2 }}
                  >
                    Reset to Defaults
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ 
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 10px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            )}

            {activeSection !== 'theme' && (
              <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: alpha(theme.palette.text.primary, 0.7) }}>
                    {sections.find(s => s.id === activeSection)?.label} Settings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    This section is under development
                  </Typography>
                  <Box 
                    component={motion.div}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    sx={{ mt: 3, opacity: 0.7 }}
                  >
                    {sections.find(s => s.id === activeSection)?.icon && (
                      <Box sx={{ 
                        fontSize: 60,
                        color: alpha(theme.palette.primary.main, 0.3),
                        '& .MuiSvgIcon-root': {
                          fontSize: 60
                        }
                      }}>
                        {sections.find(s => s.id === activeSection)?.icon}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings; 