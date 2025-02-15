import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { ERROR_CODES, getErrorMessage } from "../types/Error"

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

const showErrorMessage = (message: string) => {
  if (globalShowToast) {
    globalShowToast(message)
  } else {
    console.error(message)
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
      showErrorMessage("응답 데이터 처리 중 오류가 발생했습니다")
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
      showErrorMessage(errorMessage)
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      showErrorMessage("서버와의 통신에 실패했습니다")
    } else {
      // 요청 자체를 보내지 못한 경우
      showErrorMessage("네트워크 연결을 확인해주세요")
    }

    return Promise.reject(error)
  },
)

export { axiosClient, queryClient }
