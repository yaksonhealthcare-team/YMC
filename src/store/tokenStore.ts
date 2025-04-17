import { create } from "zustand"
import { saveAccessToken, removeAccessToken } from "../queries/clients"
import { axiosClient } from "../queries/clients"

interface TokenState {
  accessToken: string | null
  isRefreshing: boolean
  refreshAttempts: number
  lastRefreshTime: number | null
  maxRefreshAttempts: number

  // 액션
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
  startRefresh: () => void
  refreshSuccess: (token: string) => void
  refreshFailure: () => void
  resetRefreshState: () => void
}

const MAX_REFRESH_ATTEMPTS = 3

export const useTokenStore = create<TokenState>((set, get) => ({
  accessToken: null,
  isRefreshing: false,
  refreshAttempts: 0,
  lastRefreshTime: null,
  maxRefreshAttempts: MAX_REFRESH_ATTEMPTS,

  setAccessToken: (token: string) => {
    // 액세스 토큰 설정
    saveAccessToken(token)
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`

    set({
      accessToken: token,
      isRefreshing: false,
      refreshAttempts: 0,
      lastRefreshTime: Date.now(),
    })
  },

  clearAccessToken: () => {
    // 액세스 토큰 제거
    removeAccessToken()
    delete axiosClient.defaults.headers.common.Authorization

    set({
      accessToken: null,
      isRefreshing: false,
      refreshAttempts: 0,
      lastRefreshTime: null,
    })
  },

  startRefresh: () => {
    // 토큰 갱신 프로세스 시작
    const { refreshAttempts } = get()

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      // 최대 시도 횟수 초과 시 실패 처리
      get().refreshFailure()
      return false
    }

    set((state) => ({
      isRefreshing: true,
      refreshAttempts: state.refreshAttempts + 1,
    }))

    return true
  },

  refreshSuccess: (token: string) => {
    // 토큰 갱신 성공
    get().setAccessToken(token)
  },

  refreshFailure: () => {
    // 토큰 갱신 실패
    set({
      isRefreshing: false,
      accessToken: null,
    })
    removeAccessToken()
    delete axiosClient.defaults.headers.common.Authorization
  },

  resetRefreshState: () => {
    // 리프레시 상태 초기화 (갱신 횟수 등)
    set({
      isRefreshing: false,
      refreshAttempts: 0,
    })
  },
}))
