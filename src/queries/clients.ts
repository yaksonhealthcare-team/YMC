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
  const token = localStorage.getItem("accessToken") || null

  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export { queryClient, axiosClient }
