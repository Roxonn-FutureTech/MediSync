import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './routes';
import LoadingIndicator from './components/common/LoadingIndicator';

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const App = () => {
  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingIndicator />}>
        <RouterProvider router={router} fallbackElement={<LoadingIndicator />} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
