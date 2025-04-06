import { Box, CircularProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  const theme = useTheme();
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
      >
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ 
            color: theme.palette.primary.main,
            filter: `drop-shadow(0 0 8px ${theme.palette.primary.main})`
          }}
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        transition={{ 
          delay: 0.3,
          duration: 0.5
        }}
      >
        <Box 
          sx={{ 
            mt: 3, 
            fontSize: '1rem', 
            fontWeight: 'medium',
            color: 'text.secondary'
          }}
        >
          Loading...
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoadingIndicator; 