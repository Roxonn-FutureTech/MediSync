import React from 'react';
import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  alpha,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Paper,
  IconButton,
  Chip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  SupportAgent as SupportIcon,
  QuestionAnswer as ChatIcon,
  Help as HelpIcon,
  Report as ReportIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  Phone as PhoneIcon,
  Forum as ForumIcon,
  Article as ArticleIcon,
  Bookmark as BookmarkIcon,
  CheckCircle as CheckCircleIcon,
  AccessTimeFilled as TimeIcon,
  HelpOutline as HelpOutlineIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Support = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1); // Default to first ticket
  const [messageText, setMessageText] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Mock support tickets
  const supportTickets = [
    { 
      id: 1, 
      title: 'System Login Issue', 
      status: 'open', 
      priority: 'high', 
      time: '2 hours ago',
      user: 'Dr. Jane Smith',
      department: 'Emergency',
      avatar: 'JS',
      lastMessage: 'I cannot access the patient records system. It shows an error after login.',
      unread: 2,
    },
    { 
      id: 2, 
      title: 'Equipment Malfunction', 
      status: 'in-progress', 
      priority: 'critical', 
      time: '1 day ago',
      user: 'Dr. Robert Chen',
      department: 'Surgery',
      avatar: 'RC',
      lastMessage: 'The MRI machine is showing calibration errors and won\'t complete scans.',
      unread: 0,
    },
    { 
      id: 3, 
      title: 'Patient Data Integration', 
      status: 'open', 
      priority: 'medium', 
      time: '3 days ago',
      user: 'Nurse Williams',
      department: 'Cardiology',
      avatar: 'NW',
      lastMessage: 'Need help connecting the patient monitoring system with EMR.',
      unread: 1,
    },
    { 
      id: 4, 
      title: 'Training Request', 
      status: 'resolved', 
      priority: 'low', 
      time: '1 week ago',
      user: 'Dr. Michael Lee',
      department: 'Neurology',
      avatar: 'ML',
      lastMessage: 'Requesting training session for new staff on emergency protocol system.',
      unread: 0,
    },
  ];

  // Mock chat messages for the selected ticket
  const chatMessages = [
    {
      id: 1,
      user: 'Dr. Jane Smith',
      avatar: 'JS',
      content: 'I cannot access the patient records system. It shows an error after login.',
      time: '2 hours ago',
      isCurrentUser: true,
    },
    {
      id: 2,
      user: 'Support Agent',
      avatar: 'SA',
      content: 'Thank you for reporting this issue. Can you please describe what error message you are seeing?',
      time: '1 hour 45 min ago',
      isCurrentUser: false,
    },
    {
      id: 3,
      user: 'Dr. Jane Smith',
      avatar: 'JS',
      content: 'It says "Authentication failed. Please contact your system administrator."',
      time: '1 hour 30 min ago',
      isCurrentUser: true,
    },
    {
      id: 4,
      user: 'Support Agent',
      avatar: 'SA',
      content: 'I understand. Let me check your account permissions. Have you recently changed your password or had any account changes?',
      time: '1 hour ago',
      isCurrentUser: false,
    },
    {
      id: 5,
      user: 'Dr. Jane Smith',
      avatar: 'JS',
      content: 'Yes, IT updated our department security protocols yesterday.',
      time: '45 min ago',
      isCurrentUser: true,
    },
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ position: 'relative', height: '100%', mt: 2, overflow: 'hidden' }}>
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
        <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 1, position: 'relative', zIndex: 2 }}>
          How can we help you?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: '70%', position: 'relative', zIndex: 2 }}>
          Get in touch with our support team or browse through common questions
        </Typography>
      </Box>
      
      {/* Support options */}
      <Grid container spacing={3} sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5, boxShadow: 6 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            sx={{ 
              p: 3, 
              borderRadius: '20px', 
              height: '100%',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
                }}
              >
                <HelpOutlineIcon color="primary" fontSize="large" />
              </Box>
              
              <Typography variant="h6" fontWeight={600} textAlign="center" gutterBottom>
                FAQs
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                Find answers to commonly asked questions about MediSync features and functionality.
              </Typography>
              
              <Button
                variant="outlined"
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  px: 3,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                View FAQs
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5, boxShadow: 6 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            sx={{ 
              p: 3, 
              borderRadius: '20px', 
              height: '100%',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: alpha(theme.palette.secondary.main, 0.1),
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -40,
                bottom: -40,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 70%)`,
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.2)} 100%)`,
                }}
              >
                <ChatIcon color="secondary" fontSize="large" />
              </Box>
              
              <Typography variant="h6" fontWeight={600} textAlign="center" gutterBottom>
                Live Chat
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                Chat with our support team in real-time to get immediate assistance with any issues.
              </Typography>
              
              <Button
                variant="contained"
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  boxShadow: (theme) => `0 10px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s',
                  },
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: (theme) => `0 15px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    '&::before': {
                      transform: 'translateX(100%)',
                    }
                  }
                }}
              >
                Start Chat
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5, boxShadow: 6 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            sx={{ 
              p: 3, 
              borderRadius: '20px', 
              height: '100%',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.2)} 100%)`,
                }}
              >
                <PhoneIcon color="info" fontSize="large" />
              </Box>
              
              <Typography variant="h6" fontWeight={600} textAlign="center" gutterBottom>
                Phone Support
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                Call our dedicated support line for personalized assistance with complex issues.
              </Typography>
              
              <Button
                variant="outlined"
                sx={{
                  mt: 'auto',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.info.main, 0.3),
                  color: theme.palette.info.main,
                  px: 3,
                  '&:hover': {
                    borderColor: theme.palette.info.main,
                    background: alpha(theme.palette.info.main, 0.05)
                  }
                }}
              >
                +1 (800) 123-4567
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Contact form section */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        sx={{ 
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderColor: (theme) => alpha(theme.palette.divider, 0.1),
          mb: 5,
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5} 
            sx={{ 
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-30%',
                right: '-30%',
                width: '90%',
                height: '160%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                Get in Touch
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
                Have questions or need assistance? Fill out the form and our support team will get back to you as soon as possible.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton sx={{ color: 'white', mr: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <EmailIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  support@medisync.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton sx={{ color: 'white', mr: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <PhoneIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  +1 (800) 123-4567
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={7} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Send us a message
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField 
                  label="Name" 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField 
                  label="Email" 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Subject" 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Message" 
                  variant="outlined" 
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    borderRadius: '12px',
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: (theme) => `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.6s',
                    },
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: (theme) => `0 15px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&::before': {
                        transform: 'translateX(100%)',
                      }
                    }
                  }}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Support; 