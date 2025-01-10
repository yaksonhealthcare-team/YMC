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

// axiosClient.interceptors.response.use(
//   (response) => {
//     const { resultCode } = response.data

//     // resultCode가 "00"이면 성공으로 처리
//     if (resultCode === "00") {
//       return response
//     }

//     // 그 외의 경우만 에러로 처리
//     throw new Error(response.data.resultMessage || "API Error")
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

export { queryClient, axiosClient }
