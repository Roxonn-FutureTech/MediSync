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
  Container,
  CircularProgress,
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
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  twoFactorToken: Yup.string()
    .when('requires2FA', {
      is: true,
      then: (schema) => schema.required('2FA Token is required'),
      otherwise: (schema) => schema
    })
});

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      twoFactorToken: '',
      requires2FA: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        const response = await login(
          values.email,
          values.password,
          values.twoFactorToken
        );

        if (response.requires2FA) {
          setRequires2FA(true);
          formik.setFieldValue('requires2FA', true);
          return;
        }

        // If we get here, login was successful
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Login error:', err);
        if (err.response?.status === 401) {
          setError('Invalid email or password');
        } else {
          setError(err.response?.data?.error || 'An error occurred during login');
        }
      } finally {
        setLoading(false);
      }
    }
  });

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
                component="h1" 
                variant={isMobile ? "h6" : "h5"} 
                align="center" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                  color: (theme) => theme.palette.primary.main
                }}
              >
                Sign In
              </Typography>

              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    sx={{ 
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

                  {requires2FA && (
                    <Grid item xs={12}>
                      <Fade in={requires2FA}>
                        <TextField
                          fullWidth
                          id="twoFactorToken"
                          name="twoFactorToken"
                          label="2FA Token"
                          value={formik.values.twoFactorToken}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.twoFactorToken &&
                            Boolean(formik.errors.twoFactorToken)
                          }
                          helperText={
                            formik.touched.twoFactorToken && formik.errors.twoFactorToken
                          }
                          size={isMobile ? "small" : "medium"}
                          autoFocus
                        />
                      </Fade>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ 
                        mt: { xs: 1, sm: 2 },
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
                      {loading ? <CircularProgress size={isMobile ? 20 : 24} /> : 'Sign In'}
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/auth/forgot-password')}
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
                        Forgot password?
                      </Link>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/auth/register')}
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
                        Don't have an account? Sign Up
                      </Link>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Slide>
        </Container>
      </Fade>
    </Box>
  );
};

export default Login; 