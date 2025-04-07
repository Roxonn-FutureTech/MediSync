import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create the context with default values
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
  systemPreference: false,
  toggleSystemPreference: () => {},
});

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
  // Check if the user prefers dark mode at the OS level
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Initialize state with prefersDarkMode value if no user preference stored
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') ? 
      localStorage.getItem('theme') as 'light' | 'dark' : 
      prefersDarkMode ? 'dark' : 'light'
  );
  
  // State to track if we should use system preference - default to false
  const [systemPreference, setSystemPreference] = useState<boolean>(
    localStorage.getItem('useSystemTheme') === 'true'
  );

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (systemPreference) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemPreference]);

  // Update theme when systemPreference changes
  useEffect(() => {
    if (systemPreference) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
      localStorage.setItem('useSystemTheme', 'true');
    } else {
      localStorage.setItem('useSystemTheme', 'false');
      localStorage.setItem('theme', mode);
    }
  }, [systemPreference]);

  // Handle mode changes
  useEffect(() => {
    if (!systemPreference) {
      localStorage.setItem('theme', mode);
    }
  }, [mode, systemPreference]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        if (!systemPreference) {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        }
      },
      mode,
      systemPreference,
      toggleSystemPreference: () => {
        setSystemPreference(prev => !prev);
      },
    }),
    [mode, systemPreference],
  );

  const theme = useMemo(
    () =>
      createTheme({
        zIndex: {
          drawer: 1200,
          appBar: 1100,
          modal: 1300,
        },
        palette: {
          mode,
          primary: {
            main: '#2563EB', // Modern blue
            light: '#60A5FA',
            dark: '#1E40AF',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#10B981', // Teal green
            light: '#34D399',
            dark: '#059669',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#EF4444', // Bright red
            light: '#F87171',
            dark: '#DC2626',
          },
          warning: {
            main: '#F59E0B', // Amber
            light: '#FBBF24',
            dark: '#D97706',
          },
          info: {
            main: '#3B82F6', // Light blue
            light: '#60A5FA',
            dark: '#2563EB',
          },
          success: {
            main: '#10B981', // Emerald green
            light: '#34D399',
            dark: '#059669',
          },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#0F172A', // Light gray or very dark blue
            paper: mode === 'light' ? '#FFFFFF' : '#1E293B', // White or dark blue-gray
          },
          text: {
            primary: mode === 'light' ? '#1E293B' : '#F1F5F9', // Dark blue-gray or light gray
            secondary: mode === 'light' ? '#64748B' : '#94A3B8', // Medium gray
          },
          divider: mode === 'light' ? 'rgba(100, 116, 139, 0.12)' : 'rgba(148, 163, 184, 0.12)',
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
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.2,
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.2,
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.2,
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          '0px 2px 4px rgba(0, 0, 0, 0.05)',
          '0px 4px 6px rgba(0, 0, 0, 0.07)',
          '0px 6px 12px rgba(0, 0, 0, 0.08)',
          '0px 8px 16px rgba(0, 0, 0, 0.09)',
          '0px 10px 20px rgba(0, 0, 0, 0.1)',
          '0px 12px 24px rgba(0, 0, 0, 0.11)',
          '0px 14px 28px rgba(0, 0, 0, 0.12)',
          '0px 16px 32px rgba(0, 0, 0, 0.13)',
          '0px 18px 36px rgba(0, 0, 0, 0.14)',
          '0px 20px 40px rgba(0, 0, 0, 0.15)',
          '0px 22px 44px rgba(0, 0, 0, 0.16)',
          '0px 24px 48px rgba(0, 0, 0, 0.17)',
          '0px 26px 52px rgba(0, 0, 0, 0.18)',
          '0px 28px 56px rgba(0, 0, 0, 0.19)',
          '0px 30px 60px rgba(0, 0, 0, 0.2)',
          '0px 32px 64px rgba(0, 0, 0, 0.21)',
          '0px 34px 68px rgba(0, 0, 0, 0.22)',
          '0px 36px 72px rgba(0, 0, 0, 0.23)',
          '0px 38px 76px rgba(0, 0, 0, 0.24)',
          '0px 40px 80px rgba(0, 0, 0, 0.25)',
          '0px 42px 84px rgba(0, 0, 0, 0.26)',
          '0px 44px 88px rgba(0, 0, 0, 0.27)',
          '0px 46px 92px rgba(0, 0, 0, 0.28)',
          '0px 48px 96px rgba(0, 0, 0, 0.29)',
        ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '*': {
                boxSizing: 'border-box',
              },
              html: {
                height: '100%',
                width: '100%',
              },
              body: {
                height: '100%',
                width: '100%',
                padding: 0,
                margin: 0,
              },
              '#root': {
                height: '100%',
                width: '100%',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
                zIndex: 1200,
                borderRight: 'none',
                boxShadow: mode === 'light' 
                  ? '0px 0px 24px rgba(0, 0, 0, 0.08)'
                  : '0px 0px 24px rgba(0, 0, 0, 0.4)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                zIndex: 1100,
                boxShadow: 'none',
                backdropFilter: 'blur(8px)',
                backgroundColor: mode === 'light' 
                  ? 'rgba(255, 255, 255, 0.8)'
                  : 'rgba(15, 23, 42, 0.8)',
                borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                boxShadow: 'none',
                fontWeight: 600,
                padding: '8px 16px',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              },
              containedPrimary: {
                background: `linear-gradient(90deg, ${mode === 'light' ? '#2563EB' : '#3B82F6'}, ${mode === 'light' ? '#1E40AF' : '#2563EB'})`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${mode === 'light' ? '#1E40AF' : '#2563EB'}, ${mode === 'light' ? '#1E3A8A' : '#1E40AF'})`,
                },
              },
              containedSecondary: {
                background: `linear-gradient(90deg, ${mode === 'light' ? '#10B981' : '#34D399'}, ${mode === 'light' ? '#059669' : '#10B981'})`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${mode === 'light' ? '#059669' : '#10B981'}, ${mode === 'light' ? '#047857' : '#059669'})`,
                },
              },
              outlined: {
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: 8,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 4px 6px rgba(0, 0, 0, 0.04)',
              },
              elevation2: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 6px 8px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light' 
                  ? '0px 4px 16px rgba(0, 0, 0, 0.08)'
                  : '0px 4px 16px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: mode === 'light' 
                    ? '0px 8px 24px rgba(0, 0, 0, 0.12)'
                    : '0px 8px 24px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-4px)',
                },
                border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'}`,
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                transition: 'all 0.2s ease-in-out',
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: 40,
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                border: `2px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
                '&.MuiChip-colorPrimary': {
                  background: mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.24)',
                  color: mode === 'light' ? '#1E40AF' : '#60A5FA',
                },
                '&.MuiChip-colorSecondary': {
                  background: mode === 'light' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(52, 211, 153, 0.24)',
                  color: mode === 'light' ? '#059669' : '#34D399',
                },
                '&.MuiChip-colorError': {
                  background: mode === 'light' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(248, 113, 113, 0.24)',
                  color: mode === 'light' ? '#DC2626' : '#F87171',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                  },
                },
              },
            },
          },
          MuiBackdrop: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
            },
          },
          MuiLoadingButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backdropFilter: 'blur(8px)',
                background: mode === 'light' 
                  ? 'rgba(0, 0, 0, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                color: mode === 'light' ? '#FFFFFF' : '#0F172A',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                fontWeight: 500,
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                padding: '16px',
              },
              head: {
                fontWeight: 600,
                backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
              },
            },
          },
          MuiBadge: {
            styleOverrides: {
              badge: {
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}; 