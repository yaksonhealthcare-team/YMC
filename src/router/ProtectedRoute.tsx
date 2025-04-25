import LoadingIndicator from "@components/LoadingIndicator"
import { fetchUser } from "apis/auth.api.ts"
import { useLayout } from "contexts/LayoutContext.tsx"
import { useOverlay } from "contexts/ModalContext.tsx"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.tsx"
import { useAppBridge } from "../hooks/useAppBridge"
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const { setNavigation } = useLayout()
  const location = useLocation()
  const { showToast } = useOverlay()

  const loadUser = async () => {
    try {
      const user = await fetchUser()
      login({ user })
    } catch (error) {
      console.error("사용자 정보 조회 실패", error)
      showToast("로그인 정보가 만료되었습니다.")
      navigate("/logout", { replace: true })
    }
  }

  useEffect(() => {
    if (user && location.pathname === "/") {
      return
    }

    loadUser()
  }, [location.pathname])

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
