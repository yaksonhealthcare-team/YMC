import React, { createContext, useContext, useEffect, useState } from "react"
import SplashScreen from "@components/Splash.tsx"
import { User } from "../types/User.ts"
import { fetchUser } from "../apis/auth.api.ts"

type AuthContextType = {
  user: User | null
  login: (userData: { user: User; token: string }) => void
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
      const storedToken = localStorage.getItem("accessToken")
      if (storedToken) {
        try {
          const { isValid, user } = await validateUserSession(storedToken)
          if (isValid && user) {
            setUser(user || null)
          } else {
            localStorage.removeItem("accessToken")
          }
        } catch (error) {
          console.error("Failed to validate user session", error)
          localStorage.removeItem("accessToken")
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = ({ user, token }: { user: User; token: string }) => {
    setUser(user)
    localStorage.setItem("accessToken", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("socialSignupInfo")
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
