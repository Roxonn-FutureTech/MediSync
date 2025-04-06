import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createCustomTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  darkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isSystemTheme: boolean;
  toggleSystemTheme: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  darkMode: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
  isSystemTheme: true,
  toggleSystemTheme: () => {},
  accentColor: '#2196f3',
  setAccentColor: () => {},
  reduceMotion: false,
  setReduceMotion: () => {},
  setDarkMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

// Alias for backward compatibility
export const useTheme = useThemeContext;

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });
  
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('useSystemTheme');
    return savedPreference !== null ? savedPreference === 'true' : true;
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    const savedColor = localStorage.getItem('accentColor');
    return savedColor || '#2196f3';
  });

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('reduceMotion');
    // Also check system preference if nothing saved
    if (savedPreference === null) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return savedPreference === 'true';
  });

  // Computed property for easier use in components
  const darkMode = mode === 'dark';

  // Function to directly set dark mode state
  const setDarkMode = (isDark: boolean) => {
    setMode(isDark ? 'dark' : 'light');
    if (isSystemTheme) {
      setIsSystemTheme(false);
    }
  };

  const theme = createCustomTheme(mode, accentColor);

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const toggleTheme = () => {
    if (isSystemTheme) {
      // If currently using system theme, switch to manual and toggle
      setIsSystemTheme(false);
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    } else {
      // Just toggle the theme
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }
  };

  const toggleSystemTheme = () => {
    setIsSystemTheme(prev => !prev);
  };

  // Handle system theme preferences
  useEffect(() => {
    if (isSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setMode(e.matches ? 'dark' : 'light');
      };

      // Initial setting
      handleSystemThemeChange(mediaQuery);
      
      // Listen for changes
      const mediaQueryListener = (e: MediaQueryListEvent) => handleSystemThemeChange(e);
      mediaQuery.addEventListener('change', mediaQueryListener);
      
      return () => {
        mediaQuery.removeEventListener('change', mediaQueryListener);
      };
    }
  }, [isSystemTheme]);

  // Check for system motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (localStorage.getItem('reduceMotion') === null) {
        setReduceMotion(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('useSystemTheme', String(isSystemTheme));
  }, [mode, isSystemTheme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('reduceMotion', String(reduceMotion));
  }, [reduceMotion]);

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      darkMode,
      toggleTheme, 
      setThemeMode, 
      isSystemTheme, 
      toggleSystemTheme,
      accentColor,
      setAccentColor,
      reduceMotion,
      setReduceMotion,
      setDarkMode
    }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 