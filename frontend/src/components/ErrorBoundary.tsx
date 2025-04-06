import React, { Component, ErrorInfo } from 'react';
import { Box, Button, Container, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Attempt to recover by refreshing the page
    window.location.href = '/';
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              py: 8,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="gpu-accelerated"
            >
              <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '3rem', md: '4rem' } }}>
                Something went wrong
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="gpu-accelerated"
            >
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                We've encountered an error and we're working to fix it. Please try refreshing the page or contact support if the problem persists.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="gpu-accelerated"
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={this.handleReset}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: theme => `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                Return to homepage
              </Button>
            </motion.div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                sx={{ 
                  mt: 6, 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  overflow: 'auto',
                  maxWidth: '100%',
                  textAlign: 'left'
                }}
              >
                <Typography variant="overline" display="block" gutterBottom color="text.secondary">
                  Developer Information
                </Typography>
                <Typography variant="body2" component="pre" sx={{ overflow: 'auto', fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="body2" component="pre" sx={{ mt: 2, overflow: 'auto', fontSize: '0.8rem' }}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 