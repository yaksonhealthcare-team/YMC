import ErrorPage from '@/components/ErrorPage';
import LoadingIndicator from '@/components/LoadingIndicator';
import { AuthProvider } from '@/contexts/AuthContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { OverlayProvider } from '@/contexts/ModalContext';
import { SignupProvider } from '@/contexts/SignupContext';
import { Suspense } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { routeConfig, RouteConfig } from './routeConfig';

export const createRoutes = () => {
  const mapRoutes = (routes: RouteConfig[]): RouteObject[] => {
    return routes.map((route) => {
      let element = route.element;

      if (route.path?.startsWith('/dev') && process.env.NODE_ENV !== 'development') {
        element = null;
      }

      if (route.path?.startsWith('/signup')) {
        element = <SignupProvider>{element}</SignupProvider>;
      }

      if (route.auth) {
        element = <ProtectedRoute>{element}</ProtectedRoute>;
      }

      element = (
        <LayoutProvider>
          <OverlayProvider>{element}</OverlayProvider>
        </LayoutProvider>
      );

      return {
        path: route.path,
        element: <Suspense fallback={<LoadingIndicator className="min-h-screen" />}>{element}</Suspense>,
        errorElement: <ErrorPage />,
        children: route.children ? mapRoutes(route.children) : undefined
      };
    });
  };

  return createBrowserRouter(mapRoutes(routeConfig));
};

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={createRoutes()} />
  </AuthProvider>
);
