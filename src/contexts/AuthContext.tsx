import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react"
import { fetchUser, logout as logoutApi } from "../apis/auth.api.ts"
import { queryClient } from "../queries/clients.ts"
import { User } from "../types/User.ts"

interface AuthContextType {
  user: User | null
  login: (userData: { user: User }) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const fetchedUser = await fetchUser()
        setUser(fetchedUser)
      } catch (error) {
        console.error("Failed to validate user session", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = useCallback(({ user: userData }: { user: User }) => {
    setUser(userData)
    localStorage.removeItem("isLoggedOut")
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error)
    } finally {
      setUser(null)
      sessionStorage.removeItem("socialSignupInfo")
      queryClient.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
