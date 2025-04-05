import { ReactNode, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import LoadingIndicator from '../LoadingIndicator';

interface RouteTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const RouteTransition = ({ children }: RouteTransitionProps) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={<LoadingIndicator />}>
        <motion.div
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {children}
        </motion.div>
      </Suspense>
    </Box>
  );
};

export default RouteTransition; 