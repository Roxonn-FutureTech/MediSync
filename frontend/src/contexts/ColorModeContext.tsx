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
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 16,
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: '24px',
                '&:last-child': {
                  paddingBottom: '24px',
                },
              },
            },
          },
          MuiCardHeader: {
            styleOverrides: {
              root: {
                padding: '24px',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
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