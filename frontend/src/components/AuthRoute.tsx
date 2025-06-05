import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthRoute = ({ children, requireAuth = true }: AuthRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth) {
    // If authentication is required and user is not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    // If authentication is not required and user is authenticated, redirect to home
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthRoute; 