import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios"
import { getErrorMessage, ERROR_CODES } from "../types/Error"
import { refreshAccessToken } from "../apis/auth.api"

// localStorage 토큰 관리 유틸리티 함수
const TOKEN_KEY = "access_token"

export const saveAccessToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error("토큰 저장 중 오류 발생:", error)
  }
}

export const getAccessToken = async (): Promise<string | null> => {
  try {
    if (localStorage.getItem(TOKEN_KEY)) {
      return localStorage.getItem(TOKEN_KEY)
    }

    return null
  } catch (error) {
    console.error("토큰 불러오기 중 오류 발생:", error)
    return null
  }
}

export const removeAccessToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error("토큰 삭제 중 오류 발생:", error)
  }
}

interface ApiResponse<T> {
  resultCode: string
  resultMessage: string
  resultCount: string
  body: T
}

// 전역 에러 메시지 표시를 위한 함수
let globalShowToast: ((message: string) => void) | null = null

export const setGlobalShowToast = (showToast: (message: string) => void) => {
  globalShowToast = showToast
}

const showErrorMessage = (message: string, errorData?: any) => {
  if (globalShowToast) {
    globalShowToast(message)
  }

  // 웹 환경에서 로깅
  console.error(message, errorData)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 3,
    },
  },
})

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  timeoutErrorMessage: "요청 시간이 초과되었습니다. 다시 시도해주세요.",
  withCredentials: true,
})

axiosClient.interceptors.request.use(async (config) => {
  // 요청 전에 localStorage에서 토큰을 가져와 헤더에 추가
  return config
})

// 요청 재시도를 위한 변수
let isRefreshing = false
let failedQueue: {
  resolve: (value: AxiosResponse<any> | Promise<AxiosResponse<any>>) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}[] = []

// 대기 중인 요청 처리
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.config.headers = prom.config.headers || {}
      prom.config.headers.Authorization = `Bearer ${token}`
      prom.resolve(axiosClient(prom.config))
    }
  })

  failedQueue = []
}

axiosClient.interceptors.response.use(
  async (response) => {
    let parsedData

    try {
      parsedData =
        typeof response.data === "string"
          ? JSON.parse(response.data.replace(/^\uFEFF/, ""))
          : response.data
    } catch (error) {
      showErrorMessage("응답 데이터 처리 중 오류가 발생했습니다", {
        responseData: response.data,
        url: response.config?.url,
        error,
      })
      throw new Error("Response data is not a valid JSON string")
    }

    const data = parsedData as ApiResponse<unknown>

    // 액세스 토큰 만료 처리
    if (data.resultCode === ERROR_CODES.TOKEN_EXPIRED) {
      // Check if the user explicitly logged out
      const isLoggedOut = localStorage.getItem("isLoggedOut") === "true"
      if (isLoggedOut) {
        processQueue(new Error("User is logged out"), null)
        return Promise.reject({ response: { data: data, status: 401 } })
      }

      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: response.config })
        })
      }

      isRefreshing = true

      try {
        // localStorage 토큰이 없거나 같은 토큰이면 토큰 갱신 시도
        const newToken = await refreshAccessToken()

        if (newToken) {
          // 토큰 갱신 성공
          const config = response.config
          config.headers.Authorization = `Bearer ${newToken}`

          // 대기 중인 요청들 처리
          processQueue(null, newToken)

          // 현재 요청 재시도
          return axiosClient(config)
        } else {
          // 토큰 갱신 실패
          processQueue(new Error("토큰 갱신 실패"), null)

          return Promise.reject({
            response: {
              data: data,
              status: 401,
            },
          })
        }
      } catch (error) {
        processQueue(error, null)

        // 토큰 만료 또는 갱신 실패 시 isLoggedOut 상태가 아니면 에러 메시지 표시
        if (localStorage.getItem("isLoggedOut") !== "true") {
          showErrorMessage(getErrorMessage(ERROR_CODES.TOKEN_EXPIRED), {
            code: ERROR_CODES.TOKEN_EXPIRED,
            url: response.config?.url,
          })
        }

        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 이메일 중복확인 API는 resultCode "23"을 정상 응답으로 처리
    if (
      data.resultCode !== "00" &&
      !(
        response.config?.url?.includes("/auth/signup/check-id") &&
        data.resultCode === "23"
      )
    ) {
      const error = new AxiosError()
      error.response = {
        ...response,
        data: {
          resultCode: data.resultCode,
          resultMessage: data.resultMessage,
        },
      }
      showErrorMessage(data.resultMessage, {
        resultCode: data.resultCode,
        url: response.config?.url,
      })
      throw error
    }

    return {
      ...response,
      data: data,
    }
  },
  async (error) => {
    const errorCode = error.response?.data?.resultCode || ""
    const errorMessage =
      error.response?.data?.resultMessage || getErrorMessage(errorCode)

    const originalRequest = error.config

    // 에러 메시지 표시
    if (error.response) {
      // 서버에서 응답이 왔지만 에러인 경우
      showErrorMessage(errorMessage, {
        code: errorCode,
        response: error.response.data,
        status: error.response.status,
        url: originalRequest?.url,
      })
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      showErrorMessage("서버와의 통신에 실패했습니다", {
        request: error.request,
        url: originalRequest?.url,
        method: originalRequest?.method,
      })
    } else {
      // 요청 자체를 보내지 못한 경우
      showErrorMessage("네트워크 연결을 확인해주세요", {
        error: error.message,
        config: originalRequest,
      })
    }

    return Promise.reject(error)
  },
)

export { axiosClient, queryClient }
