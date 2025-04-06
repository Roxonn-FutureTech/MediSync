import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingIndicator from './components/common/LoadingIndicator';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import EmergencyDashboard from './pages/EmergencyDashboard';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const Layout = lazy(() => import('./components/Layout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientDetail = lazy(() => import('./pages/Patients/PatientDetail'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Settings = lazy(() => import('./pages/Settings'));
const Hospitals = lazy(() => import('./pages/Hospitals'));
const Staff = lazy(() => import('./pages/Staff'));
const Emergencies = lazy(() => import('./pages/Emergencies'));
const NotFound = lazy(() => import('./pages/NotFound'));

function MainContent() {
  const { isAuthenticated, loading } = useAuth();
  const { mode } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Simpler animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  // Custom suspense fallback with simpler animation
  const SuspenseFallback = () => (
    <Box 
      className="gpu-accelerated"
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100%' 
      }}
    >
      <LoadingIndicator />
    </Box>
  );

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <SuspenseFallback />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    key="login"
                    className="gpu-accelerated"
                    variants={shouldReduceMotion ? undefined : pageVariants}
                    initial={shouldReduceMotion ? undefined : "initial"}
                    animate={shouldReduceMotion ? undefined : "in"}
                    exit={shouldReduceMotion ? undefined : "out"}
                  >
                    <Login />
                  </motion.div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    key="register"
                    className="gpu-accelerated"
                    variants={shouldReduceMotion ? undefined : pageVariants}
                    initial={shouldReduceMotion ? undefined : "initial"}
                    animate={shouldReduceMotion ? undefined : "in"}
                    exit={shouldReduceMotion ? undefined : "out"}
                  >
                    <Register />
                  </motion.div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <motion.div
                  key="forgot-password"
                  className="gpu-accelerated"
                  variants={shouldReduceMotion ? undefined : pageVariants}
                  initial={shouldReduceMotion ? undefined : "initial"}
                  animate={shouldReduceMotion ? undefined : "in"}
                  exit={shouldReduceMotion ? undefined : "out"}
                >
                  <ForgotPassword />
                </motion.div>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <motion.div
                  key="reset-password"
                  className="gpu-accelerated"
                  variants={shouldReduceMotion ? undefined : pageVariants}
                  initial={shouldReduceMotion ? undefined : "initial"}
                  animate={shouldReduceMotion ? undefined : "in"}
                  exit={shouldReduceMotion ? undefined : "out"}
                >
                  <ResetPassword />
                </motion.div>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="hospitals" element={<Hospitals />} />
              <Route path="staff" element={<Staff />} />
              <Route path="emergencies" element={<EmergencyDashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route 
              path="*" 
              element={
                <motion.div
                  key="not-found"
                  className="gpu-accelerated"
                  variants={shouldReduceMotion ? undefined : pageVariants}
                  initial={shouldReduceMotion ? undefined : "initial"}
                  animate={shouldReduceMotion ? undefined : "in"}
                  exit={shouldReduceMotion ? undefined : "out"}
                >
                  <NotFound />
                </motion.div>
              } 
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <MainContent />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
