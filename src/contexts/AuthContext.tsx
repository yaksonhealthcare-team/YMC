import React, { createContext, useContext, useEffect, useState } from "react"
import SplashScreen from "@components/Splash.tsx"
import { User } from "../types/User.ts"
import { fetchUser, logout as logoutApi } from "../apis/auth.api.ts"
import { queryClient } from "../queries/clients.ts"

type AuthContextType = {
  user: User | null
  login: (userData: { user: User }) => void
  logout: () => void
  isLoading: boolean
} | null

const AuthContext = createContext<AuthContextType>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      return
    }

    const loadUser = async () => {
      try {
        const user = await fetchUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to validate user session", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = ({ user }: { user: User }) => {
    setUser(user)
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error)
    } finally {
      setUser(null)
      sessionStorage.removeItem("socialSignupInfo")

      // 모든 쿼리 캐시 초기화
      queryClient.clear()
    }
  }

  const value = { user, login, logout, isLoading } as AuthContextType

  if (isLoading) {
    return <SplashScreen />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
