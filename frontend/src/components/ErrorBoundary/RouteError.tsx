import { useRouteError } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const RouteError = () => {
  const error = useRouteError() as Error;

  const handleRefresh = () => {
    window.location.reload();
  };

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
                {error?.message || error?.toString()}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Refresh Page
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default RouteError; 