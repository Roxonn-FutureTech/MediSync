import { Box, Card, Typography, useTheme, alpha, Skeleton } from '@mui/material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
  loading?: boolean;
}

const StatCard = ({ title, value, icon, trend, color = 'primary', loading = false }: StatCardProps) => {
  const theme = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Simpler animation variants for better performance
  const valueVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.05
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(
          theme.palette[color].dark,
          0.05
        )} 100%)`,
        boxShadow: `0 8px 32px -8px ${alpha(theme.palette[color].main, 0.2)}`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.05)}`,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
        <motion.div
          variants={shouldReduceMotion ? undefined : iconVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          whileHover={shouldReduceMotion ? undefined : "hover"}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette[color].main,
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.2)}`,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {icon}
          </Box>
        </motion.div>
        {trend && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
            style={{ marginLeft: 'auto' }}
          >
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                pl: 1,
                pr: 1,
                borderRadius: 1,
                backgroundColor: alpha(
                  trend.isPositive ? theme.palette.success.main : theme.palette.error.main, 
                  0.1
                ),
              }}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </Typography>
          </motion.div>
        )}
      </Box>
      <AnimatePresence mode="wait" presenceAffectsLayout={false}>
        {loading ? (
          <Box key="loading" sx={{ mb: 1 }}>
            <Skeleton variant="text" width="80%" height={40} />
          </Box>
        ) : (
          <motion.div
            key="content"
            variants={shouldReduceMotion ? undefined : valueVariants}
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            exit={shouldReduceMotion ? undefined : "exit"}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1, 
                color: theme.palette[color].main,
                fontWeight: 700,
                textShadow: `0 2px 4px ${alpha(theme.palette[color].main, 0.1)}`
              }}
            >
              {value}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme.palette.text.secondary,
          fontWeight: 500,
          mt: 'auto',
          opacity: 0.8,
          transition: 'opacity 0.2s',
        }}
      >
        {title}
      </Typography>
    </Card>
  );
};

export default StatCard; 