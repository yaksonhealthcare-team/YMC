import { getUser, removeAccessToken, useUserStore } from '@/_domain/auth';
import ErrorPage from '@/components/ErrorPage';
import { LayoutProvider } from '@/stores/LayoutContext';
import { OverlayProvider } from '@/stores/ModalContext';
import { SignupProvider } from '@/stores/SignupContext';
import { PropsWithChildren } from 'react';
import { createBrowserRouter, LoaderFunction, Outlet, redirect, RouterProvider } from 'react-router-dom';
import config, { CustomRouteObject } from './newConfig';
import { useNewAppBridge } from '@/hooks/useNewAppBridge';
import { useOverlayBackHandler } from '@/_shared';

const Router = () => {
  const routes: CustomRouteObject[] = config.map((route) => {
    if (route.isDev && process.env.NODE_ENV !== 'development') {
      return {};
    }

    return {
      path: route.path,
      element: route.element,
      errorElement: <ErrorPage />,
      loader: route.noAuth ? undefined : requireAuth
    };
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AppProviders>
          <BridgeMount />
          <Outlet />
        </AppProviders>
      ),
      errorElement: <ErrorPage />,
      children: routes
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;

const AppProviders = ({ children }: PropsWithChildren) => (
  <SignupProvider>
    <OverlayProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </OverlayProvider>
  </SignupProvider>
);

/**
 * 웹뷰 통신을 위한 훅 선언
 */
const BridgeMount = () => {
  useNewAppBridge();
  useOverlayBackHandler();

  return null;
};

/**
 * 유저 검증 및 데이터 호출
 */
const requireAuth: LoaderFunction = async () => {
  try {
    const { setUser } = useUserStore.getState();

    const response = await getUser();
    const user = response.data.body[0] || null;
    setUser(user);

    return null;
  } catch {
    removeAccessToken();
    return redirect('/login');
  }
};
