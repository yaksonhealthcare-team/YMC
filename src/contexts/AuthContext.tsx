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

const validateUserSession = async (
  token: string,
): Promise<{ isValid: boolean; user: User | null }> => {
  try {
    const user = await fetchUser(token)
    return { isValid: true, user: user }
  } catch (error) {
    console.error(error)
    return { isValid: false, user: null }
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to validate user session", error)
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
