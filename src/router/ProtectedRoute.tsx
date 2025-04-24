import LoadingIndicator from "@components/LoadingIndicator"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.tsx"
import { useAppBridge } from "../hooks/useAppBridge"
import { useLayout } from "contexts/LayoutContext.tsx"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { setNavigation } = useLayout()

  useEffect(() => {
    if (isLoading) {
      setNavigation({ display: false })
      return
    }

    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [isLoading, user, navigate])

  useAppBridge()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return children
}

export default ProtectedRoute
