import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GeneralErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              width: '100%',
              maxWidth: 600,
              textAlign: 'center',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
                opacity: 0.8,
              }}
            />
            
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.05), 
                  borderRadius: 2,
                  mb: 3,
                  maxHeight: 200,
                  overflow: 'auto',
                  textAlign: 'left'
                }}
              >
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {this.state.error.message}
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.handleRefresh}
              sx={{ borderRadius: 2 }}
            >
              Refresh Page
            </Button>
            
            <Typography variant="caption" sx={{ display: 'block', mt: 4, color: 'text.secondary' }}>
              If this problem persists, please contact the support team
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default GeneralErrorBoundary; 