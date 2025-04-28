import { Box, CircularProgress, Typography, useTheme, alpha, keyframes } from '@mui/material';
import { motion } from 'framer-motion';

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingIndicator = ({ 
  message = 'Loading...', 
  fullScreen = true 
}: LoadingIndicatorProps) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        width: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200px',
          height: '200px',
          backgroundColor: alpha(theme.palette.primary.main, mode === 'light' ? 0.05 : 0.08),
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: `${pulse} 3s ease-in-out infinite`,
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component={motion.div}
          animate={{ 
            rotate: 360,
            transition: { 
              repeat: Infinity, 
              duration: 2,
              ease: "linear"
            }
          }}
          sx={{
            position: 'relative',
            width: 50,
            height: 50,
            mb: 2,
          }}
        >
          <CircularProgress
            size={50}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </Box>
        
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingIndicator; 