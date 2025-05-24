import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Step,
  Stepper,
  StepLabel
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../../contexts/AuthContext';

const validationSchema = Yup.object({
  token: Yup.string()
    .matches(/^\d{6}$/, 'Token must be 6 digits')
    .required('Token is required')
});

const steps = ['Generate Secret', 'Scan QR Code', 'Verify Token'];

const TwoFactorSetup: React.FC = () => {
  const navigate = useNavigate();
  const { enable2FA } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      token: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        // In a real application, we would verify the token here
        // For demo purposes, we'll just move to the next step
        setActiveStep((prevStep) => prevStep + 1);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err: any) {
        setError('Invalid verification code');
      }
    }
  });

  const handleGenerateSecret = async () => {
    try {
      const response = await enable2FA();
      setSecret(response.secret);
      // Generate QR code URL for authenticator apps
      // Format: otpauth://totp/App:user@email.com?secret=JBSWY3DPEHPK3PXP&issuer=App
      const qrUrl = `otpauth://totp/MediSync:${encodeURIComponent(
        'user@email.com'
      )}?secret=${response.secret}&issuer=MediSync`;
      setQrCodeUrl(qrUrl);
      setActiveStep(1);
    } catch (err: any) {
      setError('Failed to generate 2FA secret');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Two-factor authentication adds an extra layer of security to your
              account. Click below to begin the setup process.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateSecret}
              sx={{ mt: 2 }}
            >
              Generate Secret
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              Scan this QR code with your authenticator app:
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </Box>
            <Typography variant="body2" color="textSecondary">
              Or enter this code manually: {secret}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setActiveStep(2)}
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Enter the 6-digit code from your authenticator app to verify the
              setup:
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="token"
                name="token"
                label="Verification Code"
                value={formik.values.token}
                onChange={formik.handleChange}
                error={formik.touched.token && Boolean(formik.errors.token)}
                helperText={formik.touched.token && formik.errors.token}
                margin="normal"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Verify
              </Button>
            </form>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">
              Two-factor authentication has been successfully enabled!
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

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
          maxWidth: 500
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Set Up Two-Factor Authentication
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </Paper>
    </Box>
  );
};

export default TwoFactorSetup; 