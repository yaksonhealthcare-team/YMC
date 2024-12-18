import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.tsx"
import { AuthProvider } from "../contexts/AuthContext.tsx"
import { LayoutProvider } from "../contexts/LayoutContext.tsx"
import routeConfig from "./routeConfig.tsx"
import { SignupProvider } from "../contexts/SignupContext.tsx"

const createRoutes = () => {
  return createBrowserRouter(
    routeConfig.map(({ path, element, auth, children }) => {
      if (path.startsWith("/signup")) {
        element = <SignupProvider>{element}</SignupProvider>
      }

      if (auth) {
        element = <ProtectedRoute>{element}</ProtectedRoute>
      }

      element = <LayoutProvider>{element}</LayoutProvider>

      return {
        path,
        element,
        children,
      }
    }),
  )
}

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={createRoutes()} />
  </AuthProvider>
)
