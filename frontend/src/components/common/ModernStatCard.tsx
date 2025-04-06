import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  alpha,
  useTheme,
  SxProps,
  Theme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface ModernStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | string;
  maxWidth?: number | string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  variant?: 'filled' | 'gradient' | 'outlined' | 'glass';
  chart?: React.ReactNode;
  pulseEffect?: boolean;
  status?: 'success' | 'warning' | 'error' | 'info' | 'none';
  tooltipText?: string;
  size?: 'small' | 'medium' | 'large';
  fluid?: boolean;
}

// Helper functions for type safety
const getHeaderBg = (variant: ModernStatCardProps['variant'], color: string, theme: Theme): string => {
  if (variant === 'gradient') {
    return `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`;
  }
  if (variant === 'filled') {
    return color;
  }
  if (variant === 'glass') {
    return 'transparent';
  }
  return 'transparent';
};

const getBorderHighlight = (variant: ModernStatCardProps['variant'], colorMain: string, theme: Theme): string => {
  if (variant === 'outlined') {
    return `1px solid ${colorMain}`;
  }
  return variant === 'glass' 
    ? `1px solid ${alpha(colorMain, 0.2)}` 
    : `1px solid ${alpha(theme.palette.common.white, 0.1)}`;
};

const getColorForGlass = (colorMain: string, theme: Theme): string => {
  return theme.palette.mode === 'dark' ? alpha(colorMain, 0.9) : colorMain;
};

const getColorForSubtitle = (variant: ModernStatCardProps['variant'], color: string, theme: Theme): string => {
  if (variant === 'gradient' || variant === 'filled') {
    return alpha('#fff', 0.85);
  }
  if (variant === 'glass') {
    return theme.palette.text.secondary;
  }
  return theme.palette.text.secondary;
};

const ModernStatCard: React.FC<ModernStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  maxWidth = 340,
  sx = {},
  onClick,
  variant = 'filled',
  chart,
  pulseEffect = false,
  status = 'none',
  tooltipText,
  size = 'medium',
  fluid = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  // Get the actual color from the theme or use the provided color
  const colorMain = (() => {
    if (typeof color === 'string') {
      // Check if it's a theme color like 'primary', 'secondary', etc.
      if (color in theme.palette) {
        const paletteColor = theme.palette[color as keyof typeof theme.palette];
        // Check if it has a 'main' property (PaletteColor type)
        if (paletteColor && typeof paletteColor === 'object' && 'main' in paletteColor) {
          return paletteColor.main;
        }
      }
      // Otherwise just return the color string itself (like '#ff0000')
      return color;
    }
    return color;
  })();
  
  // Dynamic sizing based on size prop
  const getSizing = () => {
    let paddingY;
    let paddingX;
    let titleSize;
    let valueSize;
    let subtitleSize;
    let iconSize;
    let trendSize;
    let cardMinHeight;
    let borderRadius;
    
    switch(size) {
      case 'small':
        paddingY = { xs: 1.25, sm: 1.5 };
        paddingX = { xs: 1.5, sm: 1.75 };
        titleSize = { xs: '0.8rem', sm: '0.85rem' };
        valueSize = { xs: '1.5rem', sm: '1.6rem' };
        subtitleSize = { xs: '0.7rem', sm: '0.75rem' };
        iconSize = { xs: 36, sm: 40 };
        trendSize = { xs: '0.7rem', sm: '0.75rem' };
        cardMinHeight = { xs: 100, sm: 110 };
        borderRadius = { xs: 8, sm: 10 };
        break;
      case 'large':
        paddingY = { xs: 2.25, sm: 2.75, md: 3 };
        paddingX = { xs: 2.5, sm: 3, md: 3.5 };
        titleSize = { xs: '1rem', sm: '1.1rem', md: '1.2rem' };
        valueSize = { xs: '2rem', sm: '2.4rem', md: '2.8rem' };
        subtitleSize = { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' };
        iconSize = { xs: 48, sm: 56, md: 64 };
        trendSize = { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' };
        cardMinHeight = { xs: 160, sm: 180, md: 200 };
        borderRadius = { xs: 12, sm: 14, md: 16 };
        break;
      default: // medium
        paddingY = { xs: 1.75, sm: 2, md: 2.25 };
        paddingX = { xs: 2, sm: 2.25, md: 2.5 };
        titleSize = { xs: '0.9rem', sm: '0.95rem', md: '1rem' };
        valueSize = { xs: '1.75rem', sm: '2rem', md: '2.2rem' };
        subtitleSize = { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' };
        iconSize = { xs: 42, sm: 48, md: 52 };
        trendSize = { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' };
        cardMinHeight = { xs: 130, sm: 150, md: 160 };
        borderRadius = { xs: 10, sm: 12, md: 14 };
    }
    
    return { 
      paddingY, paddingX, titleSize, valueSize, subtitleSize, 
      iconSize, trendSize, cardMinHeight, borderRadius 
    };
  };
  
  const { 
    paddingY, paddingX, titleSize, valueSize, subtitleSize, 
    iconSize, trendSize, cardMinHeight, borderRadius 
  } = getSizing();

  // Status icon
  const StatusIcon = useMemo(() => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return null;
    }
  }, [status]);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20, 
        duration: 0.5 
      } 
    },
    hover: onClick ? { 
      y: -5, 
      boxShadow: theme.shadows[6],
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 20 
      }
    } : {},
  };

  // Pulse animation for the value
  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  return (
    <MotionCard
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: cardMinHeight,
        maxWidth: fluid ? '100%' : maxWidth,
        width: fluid ? '100%' : 'auto',
        borderRadius: borderRadius,
        cursor: onClick ? 'pointer' : 'default',
        background: variant === 'glass' 
          ? alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.8)
          : getHeaderBg(variant, colorMain, theme),
        backdropFilter: variant === 'glass' ? 'blur(8px)' : 'none',
        border: getBorderHighlight(variant, colorMain, theme),
        boxShadow: variant === 'glass' 
          ? `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`
          : theme.shadows[variant === 'outlined' ? 0 : 4],
        ...sx,
      }}
    >
      <CardContent 
        sx={{ 
          px: paddingX,
          py: paddingY,
          '&:last-child': { pb: paddingY }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Icon and Title Section */}
          <Grid item xs={chart ? 12 : icon ? 8 : 12}>
            <Grid container spacing={1} alignItems="center">
              {/* Icon */}
              {icon && (
                <Grid item>
                  <Box
                    sx={{
                      width: iconSize,
                      height: iconSize,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: 
                        variant === 'outlined' || variant === 'glass'
                          ? alpha(colorMain, 0.1)
                          : alpha(theme.palette.common.white, 0.2),
                      color: 
                        variant === 'outlined' || variant === 'glass'
                          ? colorMain
                          : theme.palette.common.white,
                    }}
                  >
                    {icon}
                  </Box>
                </Grid>
              )}
              
              {/* Title */}
              <Grid item xs>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: titleSize,
                    color: 
                      variant === 'outlined' || variant === 'glass'
                        ? theme.palette.text.primary
                        : theme.palette.common.white,
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {title}
                  {tooltipText && (
                    <Tooltip title={tooltipText} arrow>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          ml: 0.5, 
                          p: 0.25,
                          color: variant === 'outlined' || variant === 'glass'
                            ? alpha(theme.palette.text.primary, 0.7)
                            : alpha(theme.palette.common.white, 0.9),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {StatusIcon && (
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 0.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: '1rem'
                      }}
                    >
                      {StatusIcon}
                    </Box>
                  )}
                </Typography>
                
                {/* Value */}
                <MotionBox
                  variants={pulseEffect ? pulseVariants : {}}
                  animate={pulseEffect ? 'pulse' : 'initial'}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: valueSize,
                      lineHeight: 1.2,
                      color: 
                        variant === 'outlined' 
                          ? getColorForGlass(colorMain, theme)
                          : variant === 'glass'
                            ? theme.palette.text.primary
                            : theme.palette.common.white,
                      mb: subtitle ? 0.5 : 0,
                    }}
                  >
                    {value}
                  </Typography>
                </MotionBox>
                
                {/* Subtitle and trend */}
                {(subtitle || trend !== undefined) && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    {subtitle && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: subtitleSize,
                          color: getColorForSubtitle(variant, colorMain, theme),
                        }}
                      >
                        {subtitle}
                      </Typography>
                    )}
                    
                    {trend !== undefined && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 
                            trend > 0
                              ? alpha(theme.palette.success.main, variant === 'outlined' || variant === 'glass' ? 0.1 : 0.2)
                              : alpha(theme.palette.error.main, variant === 'outlined' || variant === 'glass' ? 0.1 : 0.2),
                          borderRadius: 1,
                          px: 0.75,
                          py: 0.25,
                        }}
                      >
                        {trend > 0 ? (
                          <KeyboardArrowUpIcon
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: '1rem',
                            }}
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: '1rem',
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: trendSize,
                            color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                          }}
                        >
                          {Math.abs(trend)}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          
          {/* Chart Section */}
          {chart && (
            <Grid 
              item 
              xs={12} 
              sx={{ 
                mt: { xs: 1, sm: 1.5 },
                height: {
                  xs: size === 'small' ? 80 : size === 'large' ? 160 : 120,
                  sm: size === 'small' ? 100 : size === 'large' ? 180 : 140,
                  md: size === 'small' ? 120 : size === 'large' ? 200 : 160
                }
              }}
            >
              {chart}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </MotionCard>
  );
};

export default ModernStatCard; 