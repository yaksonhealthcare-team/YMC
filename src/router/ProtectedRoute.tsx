import SplashScreen from "@components/Splash.tsx"
import { useAuth } from "../contexts/AuthContext.tsx"
import { Navigate, useLocation } from "react-router-dom"
import { useAppBridge } from "../hooks/useAppBridge"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  useAppBridge()

  if (isLoading) {
    return <SplashScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
