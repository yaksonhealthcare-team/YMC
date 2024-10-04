import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./Protectedroute.tsx"
import { AuthProvider } from "../auth/AuthContext.tsx"
import { LayoutProvider } from "../layout/LayoutContext.tsx"
import routeConfig from "./routeConfig.tsx"

const createRoutes = () => {
  return createBrowserRouter(
    routeConfig.map(({ path, element, auth }) => ({
      path,
      element: auth ? (
        <LayoutProvider>
          <ProtectedRoute>{element}</ProtectedRoute>
        </LayoutProvider>
      ) : (
        <LayoutProvider>{element}</LayoutProvider>
      ),
    })),
  )
}

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={createRoutes()} />
  </AuthProvider>
)
