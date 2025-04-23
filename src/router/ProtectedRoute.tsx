import SplashScreen from "@components/Splash.tsx"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.tsx"
import { useAppBridge } from "../hooks/useAppBridge"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [isLoading, user, navigate])

  useAppBridge()

  if (isLoading) {
    return <SplashScreen />
  }

  return children
}

export default ProtectedRoute
