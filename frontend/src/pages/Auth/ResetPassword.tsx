import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  AlertTitle,
  useTheme,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Check, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const ResetPassword: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  // Get token from URL params
  const [token, setToken] = useState<string>('');
  
  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Validation state
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Extract token from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      setPassword(value);
      setPasswordError('');
      
      // Check if confirm password matches
      if (confirmPassword && value !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else if (confirmPassword) {
        setConfirmPasswordError('');
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      
      // Check if passwords match
      if (password && value !== password) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
    
    if (error) clearError();
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate token
    if (!token) {
      // Handle missing token error
      navigate('/auth/forgot-password');
      return false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await resetPassword(token, password);
        
        // Display success message
        setSuccessMessage('Your password has been successfully reset. You will be redirected to the login page shortly.');
        
        // Clear form
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (err) {
        // Error is handled in the AuthContext
      }
    }
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
              Reset Password
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ textAlign: 'center', maxWidth: 450, mb: 3 }}>
              Enter your new password below to reset your account password.
            </Typography>
            
            {!token && (
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 2 }}
              >
                <AlertTitle>Invalid Reset Link</AlertTitle>
                The password reset link is invalid or expired. Please request a new password reset.
              </Alert>
            )}
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 2 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}
            
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ width: '100%', mb: 2 }}
                icon={<Check fontSize="inherit" />}
              >
                <AlertTitle>Success</AlertTitle>
                {successMessage}
              </Alert>
            )}
            
            {token && !successMessage && (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleChange}
                  error={!!passwordError}
                  helperText={passwordError || "Password must be at least 8 characters long"}
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
                          onClick={() => togglePasswordVisibility('password')}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleChange}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? undefined : <Check />}
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
                </Button>
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Link 
                component={RouterLink} 
                to="/auth/login" 
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <ArrowBack fontSize="small" />
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ResetPassword; 