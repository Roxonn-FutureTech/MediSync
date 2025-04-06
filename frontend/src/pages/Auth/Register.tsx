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
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  Badge,
  LocalHospital,
  MedicalServices,
  AppRegistration,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole | '';
  hospital: string;
  department: string;
}

const initialFormValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  role: '',
  hospital: '',
  department: '',
};

// Sample hospitals and departments
const hospitals = [
  'Central Hospital',
  'Metropolitan General',
  'City Medical Center',
  'County Hospital',
  'Memorial Hospital',
  'University Medical Center',
  'St. John\'s Hospital',
  'Mercy Medical Center',
];

const departments = {
  'admin': ['Administration', 'IT', 'Management'],
  'doctor': ['Emergency', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
  'nurse': ['Emergency', 'ICU', 'General', 'Pediatrics', 'Surgery'],
  'paramedic': ['Ambulance', 'First Response', 'Critical Care Transport'],
  'dispatcher': ['Dispatch Center', 'Command Center', 'Coordination'],
};

const Register: React.FC = () => {
  const theme = useTheme();
  const { register, isLoading, error, clearError } = useAuth();
  
  // Form state
  const [values, setValues] = useState<FormValues>(initialFormValues);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  
  // Registration steps
  const steps = ['Account Information', 'Personal Details', 'Role & Organization'];
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setValues({ ...values, [name]: value });
      
      // Clear specific error when field is edited
      if (errors[name as keyof FormValues]) {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
      
      // Special case for password & confirm password
      if (name === 'password' && values.confirmPassword) {
        if (value !== values.confirmPassword) {
          setErrors({
            ...errors,
            confirmPassword: 'Passwords do not match',
          });
        } else {
          setErrors({
            ...errors,
            confirmPassword: '',
          });
        }
      }
      
      if (name === 'confirmPassword' && values.password) {
        if (value !== values.password) {
          setErrors({
            ...errors,
            confirmPassword: 'Passwords do not match',
          });
        } else {
          setErrors({
            ...errors,
            confirmPassword: '',
          });
        }
      }
    }
    
    if (error) clearError();
  };
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors: Partial<FormValues> = {};
    
    if (step === 0) {
      // Validate email
      if (!values.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
      }
      
      // Validate password
      if (!values.password.trim()) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (values.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }
      
      // Validate confirm password
      if (!values.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    } else if (step === 1) {
      // Validate first name
      if (!values.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      // Validate last name
      if (!values.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
    } else if (step === 2) {
      // Validate role
      if (!values.role) {
        newErrors.role = 'Role is required';
        isValid = false;
      }
      
      // Hospital and department are optional but recommended
      // No validation for now
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        // Final submission
        const { confirmPassword, ...registrationData } = values;
        
        try {
          await register({
            ...registrationData,
            role: registrationData.role as UserRole, // Type assertion since we've validated it's not empty
          });
        } catch (error) {
          // Error is handled in the AuthContext
        }
      }
    }
  };
  
  // Move to previous step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
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
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.role}
            >
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={values.role}
                label="Role"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Badge color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="nurse">Nurse</MenuItem>
                <MenuItem value="paramedic">Paramedic</MenuItem>
                <MenuItem value="dispatcher">Dispatcher</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
            
            <FormControl 
              fullWidth 
              margin="normal"
            >
              <InputLabel id="hospital-label">Hospital</InputLabel>
              <Select
                labelId="hospital-label"
                id="hospital"
                name="hospital"
                value={values.hospital}
                label="Hospital"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LocalHospital color="action" />
                  </InputAdornment>
                }
              >
                {hospitals.map((hospital) => (
                  <MenuItem key={hospital} value={hospital}>{hospital}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select your primary hospital</FormHelperText>
            </FormControl>
            
            <FormControl 
              fullWidth 
              margin="normal"
              disabled={!values.role}
            >
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department"
                value={values.department}
                label="Department"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <MedicalServices color="action" />
                  </InputAdornment>
                }
              >
                {values.role && departments[values.role as keyof typeof departments]?.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select your department</FormHelperText>
            </FormControl>
          </>
        );
      default:
        return 'Unknown step';
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
            mt: 5,
            mb: 5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
              Create Account
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Join the MediSync emergency response network
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
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
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  endIcon={activeStep < steps.length - 1 ? <ArrowForward /> : <AppRegistration />}
                  sx={{ minWidth: 120 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : activeStep < steps.length - 1 ? (
                    'Next'
                  ) : (
                    'Register'
                  )}
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ width: '100%', mt: 4, mb: 2 }} />
            
            <Link component={RouterLink} to="/auth/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register; 