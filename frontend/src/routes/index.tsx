import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Hospitals = lazy(() => import('../pages/Hospitals'));
const Emergencies = lazy(() => import('../pages/Emergencies'));
const Staff = lazy(() => import('../pages/Staff'));
const Settings = lazy(() => import('../pages/Settings'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingIndicator />}>
    {children}
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <LoadingIndicator />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
      },
      {
        path: 'hospitals',
        element: <SuspenseWrapper><Hospitals /></SuspenseWrapper>,
      },
      {
        path: 'emergencies',
        element: <SuspenseWrapper><Emergencies /></SuspenseWrapper>,
      },
      {
        path: 'staff',
        element: <SuspenseWrapper><Staff /></SuspenseWrapper>,
      },
      {
        path: 'settings',
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>,
      },
    ],
  },
]; 