import { Box, CircularProgress } from '@mui/material';

export const LoadingIndicator = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      zIndex: 9999,
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: '#fff' }} />
  </Box>
);

export default LoadingIndicator; 