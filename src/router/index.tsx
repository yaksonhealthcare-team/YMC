import { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.tsx"
import { AuthProvider } from "../contexts/AuthContext.tsx"
import { LayoutProvider } from "../contexts/LayoutContext.tsx"
import { routeConfig, RouteConfig } from "./routeConfig"
import { SignupProvider } from "../contexts/SignupContext.tsx"
import LoadingIndicator from "@components/LoadingIndicator"

const createRoutes = () => {
  return createBrowserRouter(
    routeConfig.map(({ path, element, auth, children }: RouteConfig) => {
      if (path.startsWith("/signup")) {
        element = <SignupProvider>{element}</SignupProvider>
      }

      if (auth) {
        element = <ProtectedRoute>{element}</ProtectedRoute>
      }

      return {
        path,
        element: (
          <Suspense fallback={<LoadingIndicator className="min-h-screen" />}>
            {element}
          </Suspense>
        ),
        children,
      }
    }),
  )
}

const Router = () => {
  return (
    <AuthProvider>
      <LayoutProvider>
        <RouterProvider router={createRoutes()} />
      </LayoutProvider>
    </AuthProvider>
  )
}

export default Router
