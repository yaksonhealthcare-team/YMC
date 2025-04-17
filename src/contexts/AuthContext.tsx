import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react"
import {
  fetchUser,
  logout as logoutApi,
  refreshAccessToken,
} from "../apis/auth.api.ts"
import { queryClient } from "../queries/clients.ts"
import { User } from "../types/User.ts"
import { usePopupActions } from "../stores/popupStore.ts"
import { useStartupPopups } from "../queries/useContentQueries.tsx"

interface AuthContextType {
  user: User | null
  login: (userData: { user: User | null }) => void
  logout: () => void
  isLoading: boolean
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
        // 먼저 fetchUser를 시도합니다
        try {
          const fetchedUser = await fetchUser()
          if (fetchedUser) {
            setUser(fetchedUser)
            return
          }
        } catch (error) {
          console.log("현재 액세스 토큰이 만료되었거나 없음")
        }

        // fetchUser가 실패하면 리프레시 토큰을 사용해 액세스 토큰 갱신 시도
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
          try {
            const fetchedUser = await fetchUser()
            setUser(fetchedUser)
          } catch (refreshError) {
            console.error(
              "새 액세스 토큰으로 사용자 정보 가져오기 실패",
              refreshError,
            )
            setUser(null)
          }
        } else {
          console.log("리프레시 토큰이 만료되었거나 없음")
          setUser(null)
        }
      } catch (error) {
        console.error("사용자 세션 검증 실패", error)
        setUser(null)
      } finally {
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

  const login = useCallback(({ user: userData }: { user: User | null }) => {
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
