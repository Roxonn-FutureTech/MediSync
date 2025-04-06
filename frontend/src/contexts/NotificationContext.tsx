import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  AlertColor, 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon, 
  Info as InfoIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  title?: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (options: { message: string, type?: AlertColor, title?: string }) => void;
  removeNotification: (id: string) => void;
  requestPermission: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const showNotification = useCallback((options: { message: string, type?: AlertColor, title?: string }) => {
    const { message, type = 'info', title } = options;
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      message,
      type,
      title,
      timestamp: new Date()
    };

    console.log("Creating new notification:", newNotification);
    setNotifications(prev => [...prev, newNotification]);

    // Show browser notification if permission granted
    if (permission === 'granted') {
      try {
        const browserNotification = new Notification(title || 'MediSync Alert', {
          body: message,
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: id,
          renotify: true,
        });

        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }

    // Auto-remove notification after 6 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 6000);
    
    return id;
  }, [permission]);

  const removeNotification = useCallback((id: string) => {
    console.log("Removing notification:", id);
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Get appropriate icon for notification type
  const getNotificationIcon = (type: AlertColor) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  // Get notification background color
  const getNotificationBgColor = (type: AlertColor) => {
    switch (type) {
      case 'success':
        return alpha(theme.palette.success.main, 0.08);
      case 'error':
        return alpha(theme.palette.error.main, 0.08);
      case 'warning':
        return alpha(theme.palette.warning.main, 0.08);
      case 'info':
      default:
        return alpha(theme.palette.info.main, 0.08);
    }
  };

  // Get notification border color
  const getNotificationBorderColor = (type: AlertColor) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification,
        requestPermission,
      }}
    >
      {children}
      
      <div 
        id="notification-portal" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          right: 0,
          width: '100%', 
          height: '100%', 
          pointerEvents: notifications.length > 0 ? 'auto' : 'none',
          zIndex: 9999,
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: 16,
          right: 16,
          zIndex: 10000,
          width: 380,
          maxWidth: '95vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
        }}>
          <AnimatePresence>
            {notifications.map(notification => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                layout
                style={{ pointerEvents: 'auto' }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.paper,
                    borderLeft: `4px solid ${getNotificationBorderColor(notification.type)}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    gap: 1.5,
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    position: 'relative',
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: getNotificationBgColor(notification.type),
                      width: 40,
                      height: 40,
                      '& svg': {
                        fontSize: '1.5rem'
                      }
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {notification.title && (
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                        {notification.title}
                      </Typography>
                    )}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                      {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  
                  <IconButton 
                    size="small"
                    onClick={() => removeNotification(notification.id)}
                    sx={{ 
                      color: theme.palette.text.secondary,
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}; 