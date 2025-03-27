import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { ERROR_CODES, getErrorMessage } from "../types/Error"

interface ApiResponse<T> {
  resultCode: string
  resultMessage: string
  resultCount: string
  body: T
}

// 플랫폼 감지를 위한 변수
const isReactNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative"

// 전역 에러 메시지 표시를 위한 함수
let globalShowToast: ((message: string) => void) | null = null

export const setGlobalShowToast = (showToast: (message: string) => void) => {
  globalShowToast = showToast
}

// React Native 로깅을 위한 함수
let reactNativeLogger:
  | ((level: "info" | "error" | "warn", message: string, data?: any) => void)
  | null = null

export const setReactNativeLogger = (
  logger: (
    level: "info" | "error" | "warn",
    message: string,
    data?: any,
  ) => void,
) => {
  reactNativeLogger = logger
}

const showErrorMessage = (message: string, errorData?: any) => {
  if (globalShowToast) {
    globalShowToast(message)
  }

  if (isReactNative && reactNativeLogger) {
    // React Native 환경에서 로깅
    reactNativeLogger("error", message, errorData)
  } else {
    // 웹 환경에서 로깅
    console.error(message, errorData)
  }
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
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || null

  if (token && config.headers.Authorization !== `Bearer ${token}`) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const refreshToken = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    const response = await axios.post(
      "https://devapi.yaksonhc.com/api/auth/refresh",
      {
        refresh_token: refreshToken,
      },
    )

    const { access_token } = response.data
    localStorage.setItem("accessToken", access_token)

    originalRequest.headers.Authorization = `Bearer ${access_token}`
    return axiosClient(originalRequest)
  } catch (error) {
    // 리프레시 토큰도 만료되었을 경우
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.href = "/login"
    return Promise.reject(error)
  }
}

axiosClient.interceptors.response.use(
  (response) => {
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

    if (data.resultCode !== "00") {
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

    // 토큰이 만료되었을 때 (401 에러)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      refreshToken(originalRequest)
    }

    // 예상된 에러 케이스 처리
    switch (errorCode) {
      case ERROR_CODES.TOKEN_EXPIRED:
        if (!originalRequest?._retry) {
          refreshToken(originalRequest)
        }
        break

      case ERROR_CODES.REFRESH_TOKEN_EXPIRED:
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        break

      case ERROR_CODES.INVALID_TOKEN:
      case ERROR_CODES.UNAUTHORIZED:
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
        break
    }

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
