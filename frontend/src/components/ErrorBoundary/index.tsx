import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Oops! Something went wrong.
              </Typography>
              <Typography color="text.secondary" paragraph>
                We apologize for the inconvenience. Please try refreshing the page.
              </Typography>
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 2, mb: 4, textAlign: 'left' }}>
                  <Typography variant="body2" color="error" component="pre" sx={{ overflowX: 'auto' }}>
                    {this.state.error?.toString()}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Refresh Page
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 