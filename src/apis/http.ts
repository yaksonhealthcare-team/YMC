import axios from "axios"

export interface HTTPResponse<T> {
  code: string
  message: string
  body: T
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})
