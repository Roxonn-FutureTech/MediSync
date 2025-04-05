import { Box, CircularProgress } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingIndicator; 