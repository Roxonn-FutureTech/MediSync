import { Box, Button, Container, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Home, Search } from '@mui/icons-material';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="gpu-accelerated"
        >
          <Typography 
            variant="h1" 
            color="primary"
            sx={{ 
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
            }}
          >
            404
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="gpu-accelerated"
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="gpu-accelerated"
        >
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              maxWidth: 500,
              mb: 4,
            }}
          >
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="gpu-accelerated"
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 3,
                fontWeight: 600,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              Go to Homepage
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 3,
                fontWeight: 600,
              }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="gpu-accelerated"
        >
          <Box 
            component="img" 
            src="/404.svg" 
            alt="404 Illustration" 
            sx={{ 
              width: '100%', 
              maxWidth: 500,
              mt: 5,
              opacity: 0.8,
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
            }} 
          />
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFound; 