import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { routes } from './routes';
import RouteError from './components/ErrorBoundary/RouteError';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthRoute from './components/AuthRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: routes,
  },
  {
    path: 'login',
    element: routes.find(route => route.path === 'login')?.element,
    errorElement: <RouteError />,
  },
  {
    path: 'register',
    element: routes.find(route => route.path === 'register')?.element,
    errorElement: <RouteError />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

const Router = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default Router; 