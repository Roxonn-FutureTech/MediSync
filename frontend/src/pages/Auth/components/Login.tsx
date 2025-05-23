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
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [requires2FA, setRequires2FA] = useState(false);

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
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
            margin="normal"
          />

          {requires2FA && (
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
              margin="normal"
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              href="#"
              variant="body2"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgot password?
            </Link>
          </Box>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Link
              href="#"
              variant="body2"
              onClick={() => navigate('/auth/register')}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 