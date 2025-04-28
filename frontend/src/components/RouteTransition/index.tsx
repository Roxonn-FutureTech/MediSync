import { ReactNode, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useTheme, alpha, IconButton } from '@mui/material';
import LoadingIndicator from '../common/LoadingIndicator';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface RouteTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = theme.palette.mode;

  // Only show back button on nested routes
  const showBackButton = location.pathname !== '/';
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        paddingTop: showBackButton ? '24px' : 0, // Create space for back button
      }}
    >
      {showBackButton && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 5,
            m: 1,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          key={location.pathname}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {children}
          </motion.div>
          
          {/* Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: -1,
              background: theme.palette.background.default,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30%',
                height: '30%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, mode === 'light' ? 0.05 : 0.02)} 0%, transparent 70%)`,
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30%',
                height: '30%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, mode === 'light' ? 0.05 : 0.02)} 0%, transparent 70%)`,
                zIndex: -1,
              }
            }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default RouteTransition; 