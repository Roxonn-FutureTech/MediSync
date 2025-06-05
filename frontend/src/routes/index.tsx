import { Suspense, lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import AuthRoute from '../components/AuthRoute';

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

// Define routes
const routes: RouteObject[] = [
  {
    path: 'login',
    element: <SuspenseWrapper><AuthRoute requireAuth={false}><Login /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'register',
    element: <SuspenseWrapper><AuthRoute requireAuth={false}><Register /></AuthRoute></SuspenseWrapper>,
  },
  {
    index: true,
    element: <SuspenseWrapper><AuthRoute><Dashboard /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'hospitals',
    element: <SuspenseWrapper><AuthRoute><Hospitals /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'emergencies',
    element: <SuspenseWrapper><AuthRoute><Emergencies /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'patients',
    element: <SuspenseWrapper><AuthRoute><Patients /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'staff',
    element: <SuspenseWrapper><AuthRoute><Staff /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'analytics',
    element: <SuspenseWrapper><AuthRoute><Analytics /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'map',
    element: <SuspenseWrapper><AuthRoute><Map /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'monitoring',
    element: <SuspenseWrapper><AuthRoute><Monitoring /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'support',
    element: <SuspenseWrapper><AuthRoute><Support /></AuthRoute></SuspenseWrapper>,
  },
  {
    path: 'settings',
    element: <SuspenseWrapper><AuthRoute><Settings /></AuthRoute></SuspenseWrapper>,
  },
];

export { routes };