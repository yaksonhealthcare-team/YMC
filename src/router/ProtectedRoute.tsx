import SplashScreen from "@components/Splash.tsx"
import { useAuth } from "../contexts/AuthContext.tsx"
import { Navigate } from "react-router-dom"
import { useAppBridge } from "../hooks/useAppBridge"
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  useAppBridge()

  if (isLoading) {
    return <SplashScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
