import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Link, 
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Left side - Login form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3, md: 4, lg: 8 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 450,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <img src={logo} alt="MediSync Logo" style={{ height: 60, marginBottom: 16 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Sign in to continue to MediSync
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            {/* Demo Account Buttons */}
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 1 }}>
                Try these demo accounts:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap', 
                justifyContent: 'center' 
              }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setEmail('jane.smith@medisync.com');
                    setPassword('password123');
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem', minWidth: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}
                >
                  Administrator
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    setEmail('john.doe@medisync.com');
                    setPassword('password123');
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem', minWidth: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}
                >
                  Doctor
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setEmail('emma.wilson@medisync.com');
                    setPassword('password123');
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem', minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  Nurse
                </Button>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" fontWeight="bold">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right side - Image and information */}
      {!isMobile && (
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 500, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              MediSync Healthcare
            </Typography>
            <Typography variant="h6" paragraph>
              Your comprehensive solution for modern healthcare management
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Streamline patient care, manage hospital resources, and improve healthcare outcomes with our integrated platform.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {['Real-time Analytics', 'Resource Management', 'Emergency Response', 'Patient Care'].map((feature) => (
                <Chip key={feature} label={feature} />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Custom chip component for features
const Chip = ({ label }: { label: string }) => (
  <Box
    sx={{
      bgcolor: 'rgba(255, 255, 255, 0.2)',
      px: 2,
      py: 1,
      borderRadius: 4,
      backdropFilter: 'blur(4px)',
      mb: 1,
    }}
  >
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export default Login; 