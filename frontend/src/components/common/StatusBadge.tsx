import { Chip, useTheme, alpha, keyframes, Badge, Tooltip } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';

type StatusType = 'critical' | 'stable' | 'moderate' | 'pending' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium';
  count?: number;
  onClick?: () => void;
  showTooltip?: boolean;
}

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(var(--color), 0.5);
  }
  50% {
    box-shadow: 0 0 10px rgba(var(--color), 0.7), 0 0 15px rgba(var(--color), 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(var(--color), 0.5);
  }
`;

const StatusBadge = ({ status, size = 'medium', count, onClick, showTooltip = false }: StatusBadgeProps) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    critical: {
      color: theme.palette.error.main,
      label: 'Critical',
      animation: pulse,
      dotColor: theme.palette.error.main,
      shadow: '0 0 10px rgba(239, 68, 68, 0.3)',
      gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
      description: 'Requires immediate attention'
    },
    stable: {
      color: theme.palette.success.main,
      label: 'Stable',
      animation: 'none',
      dotColor: theme.palette.success.main,
      shadow: '0 0 10px rgba(16, 185, 129, 0.2)',
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
      description: 'Normal operation'
    },
    moderate: {
      color: theme.palette.warning.main,
      label: 'Moderate',
      animation: 'none',
      dotColor: theme.palette.warning.main,
      shadow: '0 0 10px rgba(245, 158, 11, 0.2)',
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
      description: 'Requires monitoring'
    },
    pending: {
      color: theme.palette.info.main,
      label: 'Pending',
      animation: 'none',
      dotColor: theme.palette.info.main,
      shadow: '0 0 10px rgba(6, 182, 212, 0.2)',
      gradient: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
      description: 'Awaiting action'
    },
    completed: {
      color: theme.palette.success.main,
      label: 'Completed',
      animation: 'none',
      dotColor: theme.palette.success.main,
      shadow: '0 0 10px rgba(16, 185, 129, 0.2)',
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
      description: 'Process finished successfully'
    },
    cancelled: {
      color: theme.palette.error.main,
      label: 'Cancelled',
      animation: 'none',
      dotColor: theme.palette.error.main,
      shadow: '0 0 10px rgba(239, 68, 68, 0.2)',
      gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
      description: 'Process terminated'
    },
  };

  const isFilled = ['critical', 'completed'].includes(status);
  
  // Enhanced badge with count
  const chipContent = (
    <Chip
      component={motion.div}
      initial={onClick ? { scale: 1 } : {}}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      label={statusConfig[status].label}
      size={size}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        backgroundColor: isFilled 
          ? 'transparent' 
          : alpha(statusConfig[status].color, mode === 'light' ? 0.12 : 0.2),
        background: isFilled 
          ? statusConfig[status].gradient 
          : undefined,
        color: isFilled 
          ? theme.palette.common.white 
          : statusConfig[status].color,
        fontWeight: 600,
        boxShadow: isHovered 
          ? `0 5px 15px ${alpha(statusConfig[status].color, 0.3)}`
          : statusConfig[status].shadow,
        borderRadius: '12px',
        border: isFilled 
          ? 'none' 
          : `1px solid ${alpha(statusConfig[status].color, 0.2)}`,
        position: 'relative',
        animation: status === 'critical' 
          ? `${pulse} 2s infinite` 
          : 'none',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: isFilled 
            ? undefined 
            : alpha(statusConfig[status].color, mode === 'light' ? 0.18 : 0.25),
          transform: onClick ? 'translateY(-2px)' : undefined,
        },
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: statusConfig[status].dotColor,
          marginRight: 1,
          boxShadow: status === 'critical' 
            ? '0 0 10px rgba(239, 68, 68, 0.7)' 
            : `0 0 5px ${alpha(statusConfig[status].color, 0.5)}`,
          animation: status === 'critical' 
            ? `${pulse} 2s infinite` 
            : status === 'pending' 
              ? `${glow} 2s infinite` 
              : 'none',
        },
        ...(isHovered && {
          '&::after': {
            content: onClick ? '"→"' : '""',
            display: 'inline-block',
            marginLeft: '4px',
            fontSize: '12px',
            transition: 'all 0.3s ease',
            animation: `${pulse} 1.5s infinite`,
          }
        })
      }}
    />
  );
  
  // If we have a count, wrap in Badge
  const badgedContent = count !== undefined ? (
    <Badge
      badgeContent={count}
      max={99}
      color={status === 'critical' ? 'error' : 
             status === 'stable' || status === 'completed' ? 'success' : 
             status === 'moderate' ? 'warning' : 'info'}
      sx={{
        '& .MuiBadge-badge': {
          fontWeight: 'bold',
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          right: -8,
          top: -4,
        }
      }}
    >
      {chipContent}
    </Badge>
  ) : chipContent;
  
  // If tooltip is enabled, wrap in Tooltip
  return showTooltip ? (
    <Tooltip 
      title={statusConfig[status].description}
      arrow
      placement="top"
    >
      {badgedContent}
    </Tooltip>
  ) : badgedContent;
};

export default StatusBadge; 