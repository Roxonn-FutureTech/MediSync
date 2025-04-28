import { Suspense, lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Hospitals = lazy(() => import('../pages/Hospitals'));
const Emergencies = lazy(() => import('../pages/Emergencies'));
const Staff = lazy(() => import('../pages/Staff'));
const Patients = lazy(() => import('../pages/Patients'));
const Settings = lazy(() => import('../pages/Settings'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Map = lazy(() => import('../pages/Map'));
const Support = lazy(() => import('../pages/Support'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const Monitoring = lazy(() => import('../pages/Monitoring'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  }>
    {children}
  </Suspense>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public route that redirects to dashboard if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Define routes as a constant to avoid Fast Refresh issues
const routes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <PublicRoute>
        <SuspenseWrapper><Login /></SuspenseWrapper>
      </PublicRoute>
    ),
  },
  {
    path: 'register',
    element: (
      <PublicRoute>
        <SuspenseWrapper><Register /></SuspenseWrapper>
      </PublicRoute>
    ),
  },
  {
    path: '',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
      },
      {
        path: 'hospitals',
        element: <SuspenseWrapper><Hospitals /></SuspenseWrapper>,
      },
      {
        path: 'emergencies',
        element: <SuspenseWrapper><Emergencies /></SuspenseWrapper>,
      },
      {
        path: 'patients',
        element: <SuspenseWrapper><Patients /></SuspenseWrapper>,
      },
      {
        path: 'staff',
        element: <SuspenseWrapper><Staff /></SuspenseWrapper>,
      },
      {
        path: 'analytics',
        element: <SuspenseWrapper><Analytics /></SuspenseWrapper>,
      },
      {
        path: 'map',
        element: <SuspenseWrapper><Map /></SuspenseWrapper>,
      },
      {
        path: 'monitoring',
        element: <SuspenseWrapper><Monitoring /></SuspenseWrapper>,
      },
      {
        path: 'support',
        element: <SuspenseWrapper><Support /></SuspenseWrapper>,
      },
      {
        path: 'settings',
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>,
      },
    ],
  },
  // Catch-all route - redirect to login if not authenticated, or to dashboard if authenticated
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

// Export routes separately to fix Fast Refresh issues
export { routes }; 