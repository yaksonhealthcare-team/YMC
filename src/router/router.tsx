import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./Protectedroute.tsx"
import routeConfig from "./routeConfig.tsx"
import { AuthProvider } from "../auth/AuthContext.tsx"
import { LayoutProvider } from "../layout/LayoutContext.tsx"

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
