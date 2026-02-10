import { getUser, removeAccessToken, useUserStore } from '@/_domain/auth';
import { setSentryBreadcrumb, useChannelTalkVisibility, useOverlayBackHandler } from '@/_shared';
import { useNewAppBridge } from '@/_shared/hooks/useNewAppBridge';
import ErrorPage from '@/components/ErrorPage';
import { LayoutProvider } from '@/stores/LayoutContext';
import { OverlayProvider } from '@/stores/ModalContext';
import { SignupProvider } from '@/stores/SignupContext';
import { PropsWithChildren, useEffect } from 'react';
import { createBrowserRouter, LoaderFunction, Outlet, redirect, RouterProvider, useLocation } from 'react-router-dom';
import { CustomRouteObject, routeConfig } from './newConfig';

export const Router = () => {
  const routes: CustomRouteObject[] = routeConfig.map((route) => {
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
          <HookBridges />
          <Outlet />
        </AppProviders>
      ),
      errorElement: <ErrorPage />,
      children: routes
    }
  ]);

  return <RouterProvider router={router} />;
};

const AppProviders = ({ children }: PropsWithChildren) => (
  <SignupProvider>
    <OverlayProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </OverlayProvider>
  </SignupProvider>
);

/**
 * 라우팅 전에 실행시킬 훅 선언
 */
const HookBridges = () => {
  useNewAppBridge();
  useOverlayBackHandler();
  useChannelTalkVisibility();
  useRouteSentryBreadcrumb();

  return null;
};

const useRouteSentryBreadcrumb = () => {
  const location = useLocation();

  useEffect(() => {
    setSentryBreadcrumb(location.pathname, new URLSearchParams(location.search));
  }, [location.pathname, location.search]);
};

/**
 * 라우팅 시 유저 검증 및 데이터 호출
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
