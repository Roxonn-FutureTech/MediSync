import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { routes } from './routes';
import { ColorModeProvider } from './context/ColorModeContext';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Create a root-level component that wraps the application with AuthProvider
const AppRoot = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

function App() {
  // Create router configuration with AppRoot as the root element
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppRoot />,
      errorElement: <ErrorBoundary />,
      children: routes,
    },
  ], {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true
    }
  });

  return (
    <ColorModeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </ColorModeProvider>
  );
}

export default App;
