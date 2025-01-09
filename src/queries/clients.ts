import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

interface ApiResponse<T> {
  resultCode: string
  resultMessage: string
  resultCount: string
  body: T
}

interface ErrorResponse {
  resultCode: string
  resultMessage: string
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

  if (token) {
    config.headers.Authorization = token
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>

    // 성공이 아닌 경우에도 에러 처리
    if (data.resultCode !== "00") {
      console.log("error: ", response)
      throw new Error(data.resultMessage)
    }

    console.log("success: ", response)
    return response
  },
  async (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data.resultCode
    const errorMessage = error.response?.data.resultMessage

    switch (errorCode) {
      // Token 관련 에러
      case "10":
        // Access Token 만료 처리
        // 여기서 토큰 갱신 로직을 구현할 수 있습니다
        break
      case "11":
        // Refresh Token 만료
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        break

      // 인증 관련 에러
      case "20":
      case "21":
        alert(errorMessage || "인증 정보가 올바르지 않습니다.")
        break

      // 요청 관련 에러
      case "24":
      case "25":
        alert(errorMessage || "잘못된 요청입니다.")
        break

      // 서버 에러
      case "50":
      case "51":
        alert(
          errorMessage ||
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        )
        break

      // 결제 관련 에러
      case "60":
      case "61":
        alert(errorMessage || "결제 처리 중 오류가 발생했습니다.")
        break

      default:
        alert(errorMessage || "알 수 없는 오류가 발생했습니다.")
    }

    return Promise.reject(error)
  },
)

export { queryClient, axiosClient }
