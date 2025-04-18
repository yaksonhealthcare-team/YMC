import { refreshAccessToken } from "@apis/auth.api"
import { QueryClient } from "@tanstack/react-query"
import axios from "axios"
import { ERROR_CODES, getErrorMessage } from "../types/Error"

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

const showErrorMessage = (message: string, errorData?: unknown) => {
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
  // 요청 전에 기본 설정만 적용
  return config
})

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

    if (data.resultCode === ERROR_CODES.TOKEN_EXPIRED) {
      const newAccessToken = await refreshAccessToken()

      // 토큰 갱신에 성공한 경우 사용자 정보 다시 요청
      if (newAccessToken) {
        response.config.headers.Authorization = `Bearer ${newAccessToken}`

        return axios(response.config)
      }

      // 토큰 갱신 후에도 데이터가 없으면 null 반환
      throw new Error("토큰 갱신 후에도 데이터가 없습니다")
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
