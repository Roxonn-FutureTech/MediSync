import { Box, Card, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
}

const StatCard = ({ title, value, icon, trend, color = 'primary' }: StatCardProps) => {
  const theme = useTheme();

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(
          theme.palette[color].dark,
          0.05
        )} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 75,
          height: 75,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)} 0%, transparent 100%)`,
          borderRadius: '0 0 0 100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette[color].main,
            backgroundColor: alpha(theme.palette[color].main, 0.1),
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Typography
            variant="body2"
            sx={{
              ml: 'auto',
              color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Typography>
        )}
      </Box>
      <Typography variant="h4" sx={{ mb: 1, color: theme.palette[color].main }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {title}
      </Typography>
    </Card>
  );
};

export default StatCard; 