import { ReactNode } from 'react';
import { ColorModeProvider } from '../contexts/ColorModeContext';
import { CssBaseline } from '@mui/material';
import GeneralErrorBoundary from '../components/ErrorBoundary/GeneralErrorBoundary';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <GeneralErrorBoundary>
      <ColorModeProvider>
        <CssBaseline />
        {children}
      </ColorModeProvider>
    </GeneralErrorBoundary>
  );
};

export default AppProvider; 