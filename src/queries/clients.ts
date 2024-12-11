import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

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
  // TODO 회원가입 기능이 완료되고 || 이후 코드 제거
  const token =
    localStorage.getItem("accessToken") ||
    `Bearer ${import.meta.env.VITE_TEST_ACCESS_TOKEN}`

  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export { queryClient, axiosClient }
