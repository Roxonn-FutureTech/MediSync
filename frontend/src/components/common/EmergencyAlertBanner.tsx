import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  DirectionsRun as RunIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyAlertBannerProps {
  type: string;
  location: string;
  timestamp: string;
  severity: 'critical' | 'major' | 'moderate';
  onClose?: () => void;
  onRespond?: () => void;
  className?: string;
  autoHideDuration?: number | null;
  expandable?: boolean;
  details?: string;
  actionRequired?: boolean;
  id: string;
}

const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  type,
  location,
  timestamp,
  severity,
  onClose,
  onRespond,
  className,
  autoHideDuration = null,
  expandable = true,
  details,
  actionRequired = false,
  id
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(true);
  const [expanded, setExpanded] = useState(false);
  
  // Get color based on severity
  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return theme.palette.error.main;
      case 'major':
        return theme.palette.warning.main;
      case 'moderate':
        return theme.palette.info.main;
      default:
        return theme.palette.error.main;
    }
  };

  // Auto hide timer
  useEffect(() => {
    if (autoHideDuration && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  // Pulse animation for critical alerts
  const isPulsing = severity === 'critical';
  
  // Handle close
  const handleClose = () => {
    setShow(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  // Handle expanding details
  const toggleExpand = () => {
    if (expandable) {
      setExpanded(!expanded);
    }
  };

  // Format time remaining
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    
    // Convert to minutes
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 120) {
      return '1 hour ago';
    } else {
      return `${Math.floor(diffMins / 60)} hours ago`;
    }
  };

  const severityColor = getSeverityColor();
  const bgColor = alpha(severityColor, 0.1);
  const borderColor = alpha(severityColor, 0.5);

  return (
    <AnimatePresence>
      {show && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: isPulsing 
              ? [
                  `0 0 0 0 ${alpha(severityColor, 0)}`,
                  `0 0 0 8px ${alpha(severityColor, 0.2)}`,
                  `0 0 0 0 ${alpha(severityColor, 0)}`
                ]
              : undefined
          }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
          sx={{
            position: 'relative',
            backgroundColor: bgColor,
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 4px 12px ${alpha(severityColor, 0.2)}`,
            overflow: 'hidden',
            mb: 2,
            width: '100%',
          }}
        >
          {/* Severity indicator line */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '6px',
              backgroundColor: severityColor,
            }}
          />
          
          {/* Main alert content */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              pl: 3,
              cursor: expandable ? 'pointer' : 'default',
            }}
            onClick={toggleExpand}
          >
            <Box
              component={motion.div}
              animate={isPulsing ? { rotate: [0, 5, 0, -5, 0] } : {}}
              transition={isPulsing ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 } : {}}
              sx={{
                mr: 2,
                color: severityColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningIcon fontSize="large" />
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1" component="div" fontWeight={600}>
                  {type}
                </Typography>
                
                <Chip 
                  size="small" 
                  color={
                    severity === 'critical' ? 'error' : 
                    severity === 'major' ? 'warning' : 'info'
                  }
                  label={severity.toUpperCase()}
                  sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                />
                
                {actionRequired && (
                  <Chip
                    size="small"
                    label="ACTION REQUIRED"
                    sx={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${borderColor}`,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}
                  />
                )}
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  mt: 1,
                  gap: { xs: 2, sm: 3 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: alpha(theme.palette.text.primary, 0.7) }} />
                  <Typography variant="body2" color="textSecondary">
                    {location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon fontSize="small" sx={{ mr: 0.5, color: alpha(theme.palette.text.primary, 0.7) }} />
                  <Typography variant="body2" color="textSecondary">
                    {formatTimeAgo(timestamp)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              {onRespond && (
                <Button
                  variant="contained"
                  color={severity === 'critical' ? 'error' : severity === 'major' ? 'warning' : 'primary'}
                  startIcon={<RunIcon />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRespond) onRespond();
                  }}
                  sx={{ mr: 1, textTransform: 'none', fontWeight: 500 }}
                >
                  Respond
                </Button>
              )}
              
              {onClose && (
                <IconButton
                  size="small"
                  aria-label="close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          
          {/* Expandable details */}
          {expandable && details && (
            <Collapse in={expanded}>
              <Box
                sx={{
                  p: 2,
                  pt: 0,
                  pl: 3,
                  pb: 2,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <Typography variant="body2" component="div">
                  {details}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color={
                      severity === 'critical' ? 'error' : 
                      severity === 'major' ? 'warning' : 'primary'
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(false);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Collapse
                  </Button>
                </Box>
              </Box>
            </Collapse>
          )}
        </Box>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlertBanner; 