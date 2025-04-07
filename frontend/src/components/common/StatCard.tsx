import { Box, Card, Typography, useTheme, alpha, Tooltip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
  description?: string;
  onClick?: () => void;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'primary', 
  description,
  onClick 
}: StatCardProps) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      component={motion.div}
      whileHover={{ 
        y: -8, 
        boxShadow: theme.shadows[8],
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${alpha(theme.palette[color].main, mode === 'light' ? 0.1 : 0.2)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, mode === 'light' ? 0.08 : 0.15)} 0%, ${alpha(
          theme.palette[color].dark,
          mode === 'light' ? 0.04 : 0.1
        )} 100%)`,
        boxShadow: `0 10px 20px -10px ${alpha(theme.palette[color].main, 0.12)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 85,
          height: 85,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.15)} 0%, transparent 100%)`,
          borderRadius: '0 0 0 100%',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 40,
          height: 40,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, transparent 100%)`,
          borderRadius: '0 100% 0 0',
          zIndex: 0
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 2 }}>
        <Box
          component={motion.div}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          sx={{
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette[color].main,
            backgroundColor: alpha(theme.palette[color].main, mode === 'light' ? 0.12 : 0.2),
            boxShadow: `0 4px 8px -2px ${alpha(theme.palette[color].main, 0.2)}`,
          }}
        >
          {icon}
        </Box>
        
        {description && (
          <Tooltip title={description} arrow placement="top">
            <IconButton 
              size="small" 
              sx={{ 
                ml: 1,
                color: alpha(theme.palette.text.primary, 0.5),
                '&:hover': {
                  color: theme.palette[color].main
                }
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        
        {trend && (
          <Typography
            component={motion.p}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            variant="body2"
            sx={{
              ml: 'auto',
              color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              py: 0.5,
              px: 1,
              borderRadius: 1,
              backgroundColor: alpha(
                trend.isPositive ? theme.palette.success.main : theme.palette.error.main, 
                0.1
              ),
            }}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Typography>
        )}
      </Box>
      
      <Typography 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        variant="h3" 
        sx={{ 
          mb: 1, 
          color: theme.palette[color].main,
          fontWeight: 700,
          position: 'relative',
          zIndex: 2,
          textShadow: `0 2px 4px ${alpha(theme.palette[color].main, 0.1)}`,
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {value}
      </Typography>
      
      <Typography 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        variant="body1" 
        sx={{ 
          color: alpha(theme.palette.text.primary, 0.8),
          fontWeight: 500,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {title}
      </Typography>
      
      {onClick && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 3,
            fontSize: 12,
            fontWeight: 600,
            color: theme.palette[color].main,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          View Details →
        </Box>
      )}
    </Card>
  );
};

export default StatCard; 