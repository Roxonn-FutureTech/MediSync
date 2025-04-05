import { useRouteError } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <Container
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: 'error.main',
          mb: 2,
        }}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 1,
          }}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{
            px: 4,
            py: 1,
          }}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorBoundary; 