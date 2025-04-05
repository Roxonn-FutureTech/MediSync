import { Chip, useTheme, alpha } from '@mui/material';

type StatusType = 'critical' | 'stable' | 'moderate' | 'pending' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium';
}

const StatusBadge = ({ status, size = 'medium' }: StatusBadgeProps) => {
  const theme = useTheme();

  const statusConfig = {
    critical: {
      color: theme.palette.error.main,
      label: 'Critical',
    },
    stable: {
      color: theme.palette.success.main,
      label: 'Stable',
    },
    moderate: {
      color: theme.palette.warning.main,
      label: 'Moderate',
    },
    pending: {
      color: theme.palette.info.main,
      label: 'Pending',
    },
    completed: {
      color: theme.palette.success.main,
      label: 'Completed',
    },
    cancelled: {
      color: theme.palette.error.main,
      label: 'Cancelled',
    },
  };

  return (
    <Chip
      label={statusConfig[status].label}
      size={size}
      sx={{
        backgroundColor: alpha(statusConfig[status].color, 0.1),
        color: statusConfig[status].color,
        fontWeight: 600,
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          marginRight: 1,
          animation: status === 'critical' ? 'pulse 2s infinite' : 'none',
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: 0.5,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
      }}
    />
  );
};

export default StatusBadge; 