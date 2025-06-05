import React from 'react';
import { Box, Typography, Button, Container, alpha, useTheme } from '@mui/material';
import { ErrorOutline, Refresh, BugReport } from '@mui/icons-material';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const theme = useTheme();
  
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = '';
  
  if (isRouteErrorResponse(error)) {
    // Error from React Router
    errorMessage = error.statusText || error.data;
    errorDetails = `${error.status} - ${error.statusText}`;
  } else if (error instanceof Error) {
    // Standard JavaScript error
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    // String error
    errorMessage = error;
  }
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          p: 5,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: 80,
            color: theme.palette.error.main,
            mb: 2,
            opacity: 0.8,
          }}
        />
        
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Oops! Something went wrong
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {errorMessage}
        </Typography>
        
        {errorDetails && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.error.main, 0.05), 
              borderRadius: 2,
              mb: 3,
              maxHeight: 200,
              overflow: 'auto',
              textAlign: 'left'
            }}
          >
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {errorDetails}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ borderRadius: 2 }}
          >
            Refresh Page
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
        
        <Typography variant="caption" sx={{ display: 'block', mt: 4, color: theme.palette.text.secondary }}>
          If this problem persists, please contact the support team
        </Typography>
      </Box>
    </Container>
  );
};

export default RouterErrorBoundary; 