import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react"
import { fetchUser, logout as logoutApi } from "../apis/auth.api.ts"
import { queryClient } from "../queries/clients.ts"
import { useStartupPopups } from "../queries/useContentQueries.tsx"
import { usePopupActions } from "../stores/popupStore.ts"
import { User } from "../types/User.ts"

interface AuthContextType {
  user: User | null
  login: (userData: { user: User | null }) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { openPopup } = usePopupActions()

  const { data: popupData, isLoading: isPopupLoading } = useStartupPopups({
    enabled: !!user,
  })

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const fetchedUser = await fetchUser()
        if (fetchedUser) {
          setUser(fetchedUser)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error("사용자 세션 검증 실패", error)
        setUser(null)
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (
      user &&
      !isLoading &&
      !isPopupLoading &&
      popupData &&
      popupData.length > 0
    ) {
      console.log(
        "User authenticated and popup data loaded, attempting to open popup.",
      )
      openPopup(popupData)
    }
  }, [user, isLoading, isPopupLoading, popupData, openPopup])

  const login = async ({ user: userData }: { user: User | null }) => {
    if (userData) {
      setUser(userData)
      localStorage.removeItem("isLoggedOut")
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error)
    } finally {
      setUser(null)
      setIsLoading(false)
      sessionStorage.removeItem("socialSignupInfo")
      queryClient.clear()
    }
  }

  const authValue = useMemo(
    () => ({ user, login, logout, isLoading, setIsLoading }),
    [user, login, logout, isLoading, setIsLoading],
  )

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
