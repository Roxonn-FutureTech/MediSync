import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  Grid,
  Fade,
  Slide
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  username: Yup.string()
    .min(3, 'Username should be of minimum 3 characters length')
    .required('Username is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  role: Yup.string()
    .oneOf(['doctor', 'nurse', 'admin', 'receptionist'], 'Please select a valid role')
    .required('Role is required')
});

const Register: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        await register(values.email, values.username, values.password, values.role);
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } catch (err: any) {
        setError(err.response?.data?.error || 'An error occurred during registration');
      } finally {
        setLoading(false);
      }
    }
  });

  const roles = [
    { value: 'doctor', label: 'Medical Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'admin', label: 'Administrator' },
    { value: 'receptionist', label: 'Receptionist' }
  ];

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          overflow: 'auto',
          bgcolor: (theme) => theme.palette.background.default,
          scrollBehavior: 'smooth',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Fade in={mounted} timeout={800}>
          <Container maxWidth="sm">
            <Slide direction="up" in={mounted} timeout={400}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: (theme) => theme.shape.borderRadius * 2,
                  boxShadow: (theme) => theme.shadows[isMobile ? 2 : 3],
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  transition: theme.transitions.create(['box-shadow', 'transform'], {
                    duration: theme.transitions.duration.standard,
                  }),
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[isMobile ? 4 : 6],
                  }
                }}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  color="primary" 
                  gutterBottom
                  textAlign="center"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 2, sm: 3 }
                  }}
                >
                  Registration Successful!
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  paragraph
                  sx={{ 
                    px: { xs: 1, sm: 2 },
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  Your account has been created. You will be redirected to the login page shortly.
                </Typography>
                <CircularProgress 
                  size={isMobile ? 20 : 24}
                  sx={{ mt: 2 }}
                />
              </Paper>
            </Slide>
          </Container>
        </Fade>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        overflow: 'auto',
        bgcolor: (theme) => theme.palette.background.default,
        scrollBehavior: 'smooth',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Fade in={mounted} timeout={800}>
        <Container 
          maxWidth="sm" 
          sx={{ 
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 },
            minHeight: 'fit-content'
          }}
        >
          <Slide direction="up" in={mounted} timeout={400}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: (theme) => theme.shape.borderRadius * 2,
                boxShadow: (theme) => theme.shadows[isMobile ? 2 : 3],
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                transition: theme.transitions.create(['box-shadow', 'transform'], {
                  duration: theme.transitions.duration.standard,
                }),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[isMobile ? 4 : 6],
                }
              }}
            >
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                gutterBottom
                textAlign="center"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                  color: (theme) => theme.palette.primary.main
                }}
              >
                Create Account
              </Typography>
              
              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      width: '100%', 
                      mb: { xs: 2, sm: 3 },
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      alignItems: 'center'
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}
              
              <Box 
                component="form" 
                onSubmit={formik.handleSubmit} 
                sx={{ 
                  width: '100%',
                  '& .MuiTextField-root': { 
                    mb: { xs: 1.5, sm: 2 },
                    transition: theme.transitions.create(['box-shadow']),
                    '&:hover': {
                      '& .MuiOutlinedInput-root': {
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      transition: theme.transitions.create(['font-size', 'transform'])
                    },
                    '& .MuiInputBase-input': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      p: isMobile ? '12px 14px' : '16.5px 14px',
                      transition: theme.transitions.create(['padding'])
                    }
                  },
                  '& .MuiFormControl-root': { 
                    mb: { xs: 1.5, sm: 2 }
                  }
                }}
              >
                <Grid container spacing={isTablet ? 1.5 : 2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="username"
                      name="username"
                      label="Username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      error={formik.touched.username && Boolean(formik.errors.username)}
                      helperText={formik.touched.username && formik.errors.username}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: theme.transitions.create(['box-shadow']),
                          '&:hover': {
                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
                          }
                        }
                      }}
                    >
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        error={formik.touched.role && Boolean(formik.errors.role)}
                        label="Role"
                      >
                        {roles.map((role) => (
                          <MenuItem 
                            key={role.value} 
                            value={role.value}
                            sx={{ 
                              fontSize: isMobile ? '0.875rem' : '1rem',
                              py: isMobile ? 1 : 1.5,
                              transition: theme.transitions.create(['background-color']),
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.role && formik.errors.role && (
                        <Typography 
                          color="error" 
                          variant="caption"
                          sx={{ 
                            mt: 0.5, 
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            transition: theme.transitions.create(['color'])
                          }}
                        >
                          {formik.errors.role}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: { xs: 2, sm: 3 }, 
                    mb: { xs: 1, sm: 2 },
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: theme.transitions.create(
                      ['background-color', 'box-shadow', 'transform'],
                      { duration: theme.transitions.duration.short }
                    ),
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[4]
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={isMobile ? 20 : 24} /> : 'Register'}
                </Button>
                
                <Box sx={{ 
                  textAlign: 'center',
                  mt: { xs: 1, sm: 2 }
                }}>
                  <Link 
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/auth/login')}
                    sx={{ 
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      textDecoration: 'none',
                      color: 'primary.main',
                      transition: theme.transitions.create(['color', 'transform']),
                      '&:hover': {
                        color: 'primary.dark',
                        textDecoration: 'underline'
                      },
                      '&:active': {
                        transform: 'scale(0.98)'
                      }
                    }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Slide>
        </Container>
      </Fade>
    </Box>
  );
};

export default Register; 