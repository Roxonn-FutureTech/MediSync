import { createTheme, alpha } from '@mui/material/styles';

export const createCustomTheme = (mode: 'light' | 'dark', accentColor: string = '#3b82f6') => {
  const isLight = mode === 'light';

  // Define common transition
  const smoothTransition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Define custom shadows with the accent color
  const customShadows = {
    small: isLight 
      ? `0px 2px 4px -1px ${alpha(accentColor, 0.07)}, 0px 1px 5px 0px ${alpha(accentColor, 0.05)}`
      : `0px 2px 4px -1px ${alpha('#000', 0.15)}, 0px 1px 5px 0px ${alpha('#000', 0.12)}`,
    medium: isLight
      ? `0px 3px 5px -1px ${alpha(accentColor, 0.1)}, 0px 5px 8px ${alpha(accentColor, 0.07)}`
      : `0px 3px 5px -1px ${alpha('#000', 0.2)}, 0px 5px 8px ${alpha('#000', 0.14)}`,
    large: isLight
      ? `0px 8px 12px -3px ${alpha(accentColor, 0.1)}, 0px 12px 20px -2px ${alpha(accentColor, 0.04)}`
      : `0px 8px 12px -3px ${alpha('#000', 0.3)}, 0px 12px 20px -2px ${alpha('#000', 0.2)}`,
    glassEffect: isLight
      ? `0 4px 30px ${alpha('#000', 0.1)}`
      : `0 4px 30px ${alpha('#000', 0.2)}`,
  };

  // Create darker and lighter versions of the accent color
  const darken = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? { 
            r: parseInt(result[1], 16), 
            g: parseInt(result[2], 16), 
            b: parseInt(result[3], 16) 
          } 
        : null;
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const darkerRgb = {
      r: Math.max(0, Math.floor(rgb.r * (1 - amount))),
      g: Math.max(0, Math.floor(rgb.g * (1 - amount))),
      b: Math.max(0, Math.floor(rgb.b * (1 - amount)))
    };
    
    return `#${darkerRgb.r.toString(16).padStart(2, '0')}${darkerRgb.g.toString(16).padStart(2, '0')}${darkerRgb.b.toString(16).padStart(2, '0')}`;
  };
  
  const lighten = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? { 
            r: parseInt(result[1], 16), 
            g: parseInt(result[2], 16), 
            b: parseInt(result[3], 16) 
          } 
        : null;
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const lighterRgb = {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))
    };
    
    return `#${lighterRgb.r.toString(16).padStart(2, '0')}${lighterRgb.g.toString(16).padStart(2, '0')}${lighterRgb.b.toString(16).padStart(2, '0')}`;
  };
  
  const accentDark = darken(accentColor, 0.15);
  const accentLight = lighten(accentColor, 0.15);

  // Modern color palette
  const emergencyRed = '#ef4444';
  const warningYellow = '#f59e0b';
  const successGreen = '#10b981';
  const infoBlue = '#3b82f6';
  
  // Glass morphism effect
  const glassMorphism = isLight
    ? {
        backgroundColor: alpha('#fff', 0.7),
        backdropFilter: 'blur(10px)',
        boxShadow: customShadows.glassEffect,
        borderRadius: 16,
      }
    : {
        backgroundColor: alpha('#0f172a', 0.7),
        backdropFilter: 'blur(10px)',
        boxShadow: customShadows.glassEffect,
        borderRadius: 16,
      };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: accentColor,
        light: accentLight,
        dark: accentDark,
        contrastText: '#fff',
      },
      secondary: {
        main: isLight ? '#9333ea' : '#a855f7', // Purple
        light: isLight ? '#a855f7' : '#c084fc',
        dark: isLight ? '#7e22ce' : '#7e22ce',
        contrastText: '#fff',
      },
      error: {
        main: emergencyRed,
        light: '#f87171',
        dark: '#b91c1c',
      },
      warning: {
        main: warningYellow,
        light: '#fbbf24',
        dark: '#d97706',
      },
      info: {
        main: infoBlue,
        light: '#60a5fa',
        dark: '#2563eb',
      },
      success: {
        main: successGreen,
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: isLight ? '#f8fafc' : '#0f172a', // Lighter gray / Very dark blue
        paper: isLight ? '#ffffff' : '#1e293b', // White / Dark blue-gray
      },
      text: {
        primary: isLight ? '#1e293b' : 'rgba(255, 255, 255, 0.9)', // Darker for contrast
        secondary: isLight ? '#475569' : 'rgba(255, 255, 255, 0.7)',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.02857em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
            scrollBehavior: 'smooth',
            margin: 0,
            padding: 0,
          },
          body: {
            transition: `background-color 0.3s ease-in-out`,
          },
          '.gpu-accelerated': {
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          },
          '.glass-morphism': {
            ...glassMorphism
          },
          '.hide-scrollbar': {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: isLight ? '#f1f1f1' : '#2d3748',
          },
          '::-webkit-scrollbar-thumb': {
            background: isLight ? '#c0c0c0' : '#4a5568',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: isLight ? '#a0a0a0' : '#718096',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            border: isLight ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: customShadows.small,
            '&:hover': {
              boxShadow: customShadows.medium
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
          },
          elevation1: {
            boxShadow: customShadows.small,
          },
          elevation2: {
            boxShadow: customShadows.medium,
          },
          elevation3: {
            boxShadow: customShadows.large,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            transition: smoothTransition,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: customShadows.medium,
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            boxShadow: customShadows.small,
          },
          containedPrimary: {
            background: `linear-gradient(145deg, ${accentColor} 0%, ${accentDark} 100%)`,
          },
          containedSecondary: {
            background: `linear-gradient(145deg, ${isLight ? '#9333ea' : '#a855f7'} 0%, ${isLight ? '#7e22ce' : '#7e22ce'} 100%)`,
          },
          outlined: {
            borderWidth: 2,
          },
          text: {
            '&:hover': {
              backgroundColor: alpha(accentColor, 0.05),
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: isLight 
              ? alpha('#ffffff', 0.8) 
              : alpha('#0f172a', 0.8),
            transition: smoothTransition,
            borderBottom: isLight 
              ? '1px solid rgba(0, 0, 0, 0.05)' 
              : '1px solid rgba(255, 255, 255, 0.05)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: isLight 
              ? '1px solid rgba(0, 0, 0, 0.05)' 
              : '1px solid rgba(255, 255, 255, 0.05)',
            backgroundImage: 'none',
            transition: smoothTransition,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: alpha(accentColor, 0.1),
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: accentColor,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
          notchedOutline: {
            transition: smoothTransition,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            fontWeight: 500,
          },
          filled: {
            '&.MuiChip-colorPrimary': {
              background: `linear-gradient(145deg, ${accentColor} 0%, ${accentDark} 100%)`,
            },
            '&.MuiChip-colorSecondary': {
              background: `linear-gradient(145deg, ${isLight ? '#9333ea' : '#a855f7'} 0%, ${isLight ? '#7e22ce' : '#7e22ce'} 100%)`,
            },
            '&.MuiChip-colorError': {
              background: `linear-gradient(145deg, ${emergencyRed} 0%, ${darken(emergencyRed, 0.2)} 100%)`,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            boxShadow: customShadows.small,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px 8px 0 0',
            '&:hover': {
              backgroundColor: alpha(accentColor, 0.05),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isLight 
              ? '1px solid rgba(0, 0, 0, 0.05)' 
              : '1px solid rgba(255, 255, 255, 0.05)',
          },
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 5,
            height: 8,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          thumb: {
            transition: smoothTransition,
            '&:hover': {
              boxShadow: `0 0 0 8px ${alpha(accentColor, 0.16)}`,
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: customShadows.medium,
            transition: smoothTransition,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: customShadows.large,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: customShadows.small,
          },
          standardError: {
            borderLeft: `6px solid ${emergencyRed}`,
          },
          standardWarning: {
            borderLeft: `6px solid ${warningYellow}`,
          },
          standardInfo: {
            borderLeft: `6px solid ${infoBlue}`,
          },
          standardSuccess: {
            borderLeft: `6px solid ${successGreen}`,
          },
        },
      },
    },
  });
};

// Export the default theme
export default createCustomTheme('light'); 