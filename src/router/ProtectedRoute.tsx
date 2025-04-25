import LoadingIndicator from "@components/LoadingIndicator"
import { fetchUser } from "apis/auth.api.ts"
import { useLayout } from "contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.tsx"
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading, login } = useAuth()
  const navigate = useNavigate()
  const { setNavigation } = useLayout()
  const location = useLocation()

  const loadUser = async () => {
    try {
      const user = await fetchUser()
      if (user) {
        login({ user })
      } else {
        navigate("/login", { replace: true })
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패", error)
    }
  }

  useEffect(() => {
    loadUser()
  }, [location.pathname])

  useEffect(() => {
    if (isLoading) {
      setNavigation({ display: false })
    }
  }, [isLoading, navigate])

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
