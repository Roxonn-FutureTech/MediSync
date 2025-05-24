import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required')
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        const response = await requestPasswordReset(values.email);
        setSuccess(
          'If an account exists with this email, you will receive password reset instructions.'
        );
        
        // In a real application, we would not expose the token
        // This is just for demonstration purposes
        if (response.token) {
          setTimeout(() => {
            navigate(`/auth/reset-password/${response.token}`);
          }, 2000);
        }
      } catch (err: any) {
        setError('An error occurred while processing your request');
      }
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>

        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Instructions
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="#"
              variant="body2"
              onClick={() => navigate('/auth/login')}
            >
              Back to Sign In
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword; 