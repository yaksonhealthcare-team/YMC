import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.tsx"
import { AuthProvider } from "../contexts/AuthContext.tsx"
import { LayoutProvider } from "../contexts/LayoutContext.tsx"

import routeConfig from "./routeConfig.tsx"

const createRoutes = () => {
  return createBrowserRouter(
    routeConfig.map(({ path, element, auth, children }) => ({
      path,
      element: auth ? (
        <LayoutProvider>
          <ProtectedRoute>{element}</ProtectedRoute>
        </LayoutProvider>
      ) : (
        <LayoutProvider>{element}</LayoutProvider>
      ),
      children,
    })),
  )
}

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={createRoutes()} />
  </AuthProvider>
)
