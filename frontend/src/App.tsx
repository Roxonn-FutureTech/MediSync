import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { routes } from './routes';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RouterErrorBoundary from './components/ErrorBoundary/RouterErrorBoundary';
import AppProvider from './providers/AppProvider';
import { AuthProvider } from './contexts/AuthContext';

// Get auth routes
const authRoutes = routes.filter(route => ['login', 'register'].includes(route.path || ''));
const protectedRoutes = routes.filter(route => !['login', 'register'].includes(route.path || ''));

// Create router configuration with future flags
const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <AuthProvider>{authRoutes.find(route => route.path === 'login')?.element}</AuthProvider>,
      errorElement: <RouterErrorBoundary />,
    },
    {
      path: '/register',
      element: <AuthProvider>{authRoutes.find(route => route.path === 'register')?.element}</AuthProvider>,
      errorElement: <RouterErrorBoundary />,
    },
    {
      path: '/',
      element: <AuthenticatedLayout />,
      errorElement: <RouterErrorBoundary />,
      children: protectedRoutes,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
