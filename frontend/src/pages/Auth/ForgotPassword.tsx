import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  AlertTitle,
} from '@mui/material';
import { Email, ArrowBack, Send } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
    setSuccessMessage('');
    
    if (error) clearError();
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
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await forgotPassword(email);
        
        // Display success message
        setSuccessMessage(`Password reset instructions have been sent to ${email}. Please check your email.`);
        
        // Clear form
        setEmail('');
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
              Forgot Password
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ textAlign: 'center', maxWidth: 450, mb: 3 }}>
              Enter your email address below and we'll send you instructions to reset your password.
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
            
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ width: '100%', mb: 2 }}
                onClose={() => setSuccessMessage('')}
              >
                <AlertTitle>Email Sent</AlertTitle>
                {successMessage}
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={isLoading ? undefined : <Send />}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Link 
                  component={RouterLink} 
                  to="/auth/login" 
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <ArrowBack fontSize="small" />
                  Back to Login
                </Link>
                
                <Link component={RouterLink} to="/auth/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ForgotPassword; 