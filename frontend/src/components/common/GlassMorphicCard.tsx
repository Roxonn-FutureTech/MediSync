import React, { ReactNode } from 'react';
import { Box, Paper, Typography, useTheme, alpha, SxProps, Theme, useMediaQuery } from '@mui/material';
import { motion, MotionProps, useReducedMotion } from 'framer-motion';

interface GlassMorphicCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerBg?: string;
  sx?: SxProps<Theme>;
  elevation?: number;
  motionProps?: MotionProps;
  glassEffect?: 'light' | 'medium' | 'heavy';
  borderHighlight?: boolean;
  rounded?: 'default' | 'medium' | 'full';
  hover?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  fluid?: boolean;
  iconSize?: 'small' | 'medium' | 'large';
}

const MotionPaper = motion(Paper);

const GlassMorphicCard: React.FC<GlassMorphicCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  headerBg,
  sx = {},
  elevation = 0,
  motionProps = {},
  glassEffect = 'medium',
  borderHighlight = false,
  rounded = 'default',
  hover = true,
  onClick,
  size = 'medium',
  fluid = false,
  iconSize = 'medium'
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Adjust properties based on size
  const getSizing = () => {
    // Base padding values
    let padding;
    let headerPadding;
    let iconSpacing;
    let titleSize;
    let subtitleSize;
    let borderRadiusValue;

    // Dynamic sizing
    switch (size) {
      case 'small':
        padding = isMobile ? 1.25 : 1.5;
        headerPadding = isMobile ? 1.25 : 1.5;
        iconSpacing = 1.25;
        titleSize = isMobile ? '0.9rem' : '1rem';
        subtitleSize = isMobile ? '0.75rem' : '0.8rem';
        borderRadiusValue = 10;
        break;
      case 'large':
        padding = { xs: 2, sm: 2.5, md: 3 };
        headerPadding = { xs: 2, sm: 2.5, md: 2.5 };
        iconSpacing = 2;
        titleSize = { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' };
        subtitleSize = { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' };
        borderRadiusValue = 16;
        break;
      default: // medium
        padding = { xs: 1.75, sm: 2, md: 2.25 };
        headerPadding = { xs: 1.75, sm: 2, md: 2 };
        iconSpacing = 1.5;
        titleSize = { xs: '1rem', sm: '1.1rem', md: '1.2rem' };
        subtitleSize = { xs: '0.8rem', sm: '0.825rem', md: '0.85rem' };
        borderRadiusValue = theme.shape.borderRadius;
    }

    return { padding, headerPadding, iconSpacing, titleSize, subtitleSize, borderRadiusValue };
  };

  // Glass effect intensity
  let blurAmount = '8px';
  let bgOpacity = isLight ? 0.6 : 0.5;
  
  if (glassEffect === 'light') {
    blurAmount = '5px';
    bgOpacity = isLight ? 0.5 : 0.4;
  } else if (glassEffect === 'heavy') {
    blurAmount = '12px';
    bgOpacity = isLight ? 0.7 : 0.6;
  }

  // Border radius based on rounded prop
  let borderRadius;
  if (rounded === 'medium') {
    borderRadius = getSizing().borderRadiusValue + 4;
  } else if (rounded === 'full') {
    borderRadius = 28;
  } else {
    borderRadius = getSizing().borderRadiusValue;
  }

  // Icon sizing
  const getIconSize = () => {
    switch (iconSize) {
      case 'small':
        return { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' };
      case 'large':
        return { xs: '1.8rem', sm: '2rem', md: '2.2rem' };
      default: // medium
        return { xs: '1.5rem', sm: '1.7rem', md: '1.8rem' };
    }
  };

  // Hover animation props
  const defaultMotionProps: MotionProps = {
    whileHover: hover && !shouldReduceMotion ? { 
      y: -5,
      boxShadow: theme.shadows[elevation + 2],
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    } : undefined,
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', duration: 0.5 }
    },
    ...motionProps
  };

  // Background based on headerBg
  const headerBackground = headerBg 
    ? `linear-gradient(135deg, ${headerBg} 0%, ${alpha(headerBg, 0.7)} 100%)`
    : undefined;

  // Border styles
  const borderStyle = borderHighlight
    ? `1px solid ${alpha(theme.palette.primary.main, isLight ? 0.2 : 0.3)}`
    : `1px solid ${alpha(theme.palette.common[isLight ? 'black' : 'white'], 0.05)}`;

  const { padding, headerPadding, iconSpacing, titleSize, subtitleSize } = getSizing();

  return (
    <MotionPaper
      elevation={elevation}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: alpha(
          isLight ? theme.palette.common.white : theme.palette.background.paper,
          bgOpacity
        ),
        backdropFilter: `blur(${blurAmount})`,
        borderRadius,
        border: borderStyle,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        width: fluid ? '100%' : 'auto',
        ...sx
      }}
      onClick={onClick}
      {...defaultMotionProps}
    >
      {(title || icon) && (
        <Box
          sx={{
            p: headerPadding,
            display: 'flex',
            alignItems: 'center',
            gap: iconSpacing,
            background: headerBackground,
            borderBottom: headerBg 
              ? 'none' 
              : `1px solid ${alpha(theme.palette.divider, 0.5)}`
          }}
        >
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: headerBg ? 'white' : theme.palette.primary.main,
                fontSize: getIconSize(),
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
            {title && (
              <Typography
                variant="h6"
                fontWeight={600}
                color={headerBg ? 'white' : 'textPrimary'}
                sx={{ 
                  fontSize: titleSize,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                color={headerBg ? alpha('#fff', 0.8) : 'textSecondary'}
                sx={{ 
                  fontSize: subtitleSize,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      <Box sx={{ p: padding }}>{children}</Box>
    </MotionPaper>
  );
};

export default GlassMorphicCard; 