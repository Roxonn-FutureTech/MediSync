import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Link,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const theme = useTheme();
  const { login, loading } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmail(value);
      setEmailError('');
    } else if (name === 'password') {
      setPassword(value);
      setPasswordError('');
    } else if (name === 'rememberMe') {
      setRememberMe(e.target.checked);
    }
    
    if (error) setError(null);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    
    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(email, password);
        // In a real app, you would handle "remember me" functionality here
        // For now, we're using localStorage for all auth data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      }
    }
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Sample user credentials for demo
  const demoCredentials = [
    { role: 'Admin', email: 'admin@medisync.com', password: 'password' },
    { role: 'Doctor', email: 'doctor@medisync.com', password: 'password' },
    { role: 'Nurse', email: 'nurse@medisync.com', password: 'password' },
    { role: 'Paramedic', email: 'paramedic@medisync.com', password: 'password' },
    { role: 'Dispatcher', email: 'dispatcher@medisync.com', password: 'password' },
  ];
  
  // Auto-fill credentials for demo
  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setEmailError('');
    setPasswordError('');
    if (error) clearError();
  };

  return (
    <Container component="main" maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            mt: 8,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
              MediSync Login
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Sign in to access the emergency medical response system
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 2 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    value="remember" 
                    color="primary" 
                    checked={rememberMe}
                    onChange={handleChange}
                    name="rememberMe"
                  />
                }
                label="Remember me"
                sx={{ mt: 1 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? undefined : <LoginIcon />}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                  <Link component={RouterLink} to="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
            
            {/* Demo credentials section */}
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Demo Accounts (Click to autofill)
              </Typography>
              
              <Grid container spacing={1}>
                {demoCredentials.map((cred) => (
                  <Grid item xs={12} sm={6} key={cred.role}>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => fillDemoCredentials(cred.email, cred.password)}
                      sx={{ 
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        my: 0.5
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {cred.role}: {cred.email}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login; 