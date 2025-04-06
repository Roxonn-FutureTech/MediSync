import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, alpha } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Create base theme with shared configurations
const createBaseTheme = (mode: ThemeMode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb', // Richer blue
        light: '#60a5fa',
        dark: '#1e40af',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6', // Purple
        light: '#a78bfa',
        dark: '#6d28d9',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
        contrastText: '#ffffff',
      },
      info: {
        main: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
      },
      background: mode === 'light' 
        ? {
            default: '#f9fafb',
            paper: '#ffffff',
          }
        : {
            default: '#111827',
            paper: '#1f2937',
          },
      text: mode === 'light'
        ? {
            primary: '#111827',
            secondary: '#4b5563',
            disabled: '#9ca3af',
          }
        : {
            primary: '#f9fafb',
            secondary: '#d1d5db',
            disabled: '#6b7280',
          },
      divider: mode === 'light' ? '#e5e7eb' : '#374151',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        letterSpacing: '0.00714em',
      },
      body1: {
        fontSize: '1rem',
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        letterSpacing: '0.01071em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.02857em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.05)',
      '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      // ... keep the rest of the default shadows
      ...Array(19).fill(''),
    ],
  });
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Create a theme instance based on current mode
  const theme = useMemo(() => {
    const baseTheme = createBaseTheme(mode);
    
    return createTheme(baseTheme, {
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: '10px 20px',
              boxShadow: 'none',
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            },
            contained: {
              '&:hover': {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.12)',
              },
            },
            outlined: {
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            },
            containedPrimary: {
              background: `linear-gradient(135deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.primary.dark})`,
            },
            containedSecondary: {
              background: `linear-gradient(135deg, ${baseTheme.palette.secondary.main}, ${baseTheme.palette.secondary.dark})`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light' 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              borderRadius: 16,
              border: '1px solid',
              borderColor: alpha(baseTheme.palette.divider, mode === 'light' ? 0.5 : 0.2),
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: mode === 'light'
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light'
                ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.06)'
                : '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)',
              borderRadius: 16,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
              backgroundImage: 'none',
              backdropFilter: 'blur(8px)',
              backgroundColor: alpha(baseTheme.palette.background.paper, mode === 'light' ? 0.9 : 0.8),
              borderBottom: `1px solid ${alpha(baseTheme.palette.divider, 0.7)}`,
            },
          },
          defaultProps: {
            color: 'default',
          },
        },
        // Add other component customizations as needed
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;