import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "../pages/home/Home.tsx"
import ProtectedRoute from "./Protectedroute.tsx"
import PageContainer from "@components/PageContainer.tsx"
import Login from "../pages/login/Login.tsx"
import { AuthProvider } from "../auth/AuthContext.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
])

export const AppRouter = () => (
  <AuthProvider>
    <PageContainer>
      <RouterProvider router={router} />
    </PageContainer>
  </AuthProvider>
)
