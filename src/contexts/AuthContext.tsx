import React, { createContext, useContext, useEffect, useState } from "react"
import SplashScreen from "@components/Splash.tsx"
import { User } from "../types/User.ts"

type AuthContextType = {
  user: User | null
  login: (userData: { username: string }) => void
  logout: () => void
  isLoading: boolean
} | null

const AuthContext = createContext<AuthContextType>(null)

const validateUserSession = async (
  token: string,
): Promise<{ isValid: boolean; user: User | null }> => {
  // 실제 구현에서는 이 부분이 백엔드 API를 호출합니다
  return new Promise((resolve) => {
    setTimeout(() => {
      // 토큰이 유효한지 확인하는 로직을 여기에 구현합니다
      // 이 예시에서는 간단히 토큰 길이로 유효성을 확인합니다
      const isValid = token.length > 10

      if (isValid) {
        // 유효한 경우, 사용자 정보를 반환합니다
        resolve({
          isValid: true,
          user: {
            id: "1",
            username: "testuser",
            email: "testuser@example.com",
          },
        })
      } else {
        // 유효하지 않은 경우
        resolve({
          isValid: false,
          user: null,
        })
      }
    }, 1000) // 1초 지연을 주어 비동기 작업을 시뮬레이션합니다 TODO: remove this line
  })
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("userToken")
      if (storedToken) {
        try {
          const { isValid, user } = await validateUserSession(storedToken)
          if (isValid && user) {
            setUser(user || null)
          } else {
            // 세션이 유효하지 않으면 로컬 스토리지를 정리합니다
            localStorage.removeItem("userToken")
          }
        } catch (error) {
          console.error("Failed to validate user session", error)
          // 에러 발생 시 로컬 스토리지를 정리합니다
          localStorage.removeItem("userToken")
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    // 실제 구현에서는 로그인 성공 시 받은 토큰을 저장합니다
    localStorage.setItem("userToken", "sample-token-" + userData.id)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("userToken")
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
