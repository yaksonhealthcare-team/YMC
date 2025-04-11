import { Suspense } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.tsx"
import { AuthProvider } from "../contexts/AuthContext.tsx"
import { LayoutProvider } from "../contexts/LayoutContext.tsx"
import { routeConfig, RouteConfig } from "./routeConfig"
import { SignupProvider } from "../contexts/SignupContext.tsx"
import { OverlayProvider } from "../contexts/ModalContext.tsx"
import LoadingIndicator from "@components/LoadingIndicator"
import ErrorPage from "@components/ErrorPage"

export const createRoutes = () => {
  const mapRoutes = (routes: RouteConfig[]): RouteObject[] => {
    return routes.map((route) => {
      let element = route.element

      if (route.path?.startsWith("/signup")) {
        element = <SignupProvider>{element}</SignupProvider>
      }

      if (route.auth) {
        element = <ProtectedRoute>{element}</ProtectedRoute>
      }

      element = (
        <LayoutProvider>
          <OverlayProvider>{element}</OverlayProvider>
        </LayoutProvider>
      )

      return {
        path: route.path,
        element: (
          <Suspense fallback={<LoadingIndicator className="min-h-screen" />}>
            {element}
          </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: route.children ? mapRoutes(route.children) : undefined,
      }
    })
  }

  return createBrowserRouter(mapRoutes(routeConfig))
}

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={createRoutes()} />
  </AuthProvider>
)
