import axios from 'axios';

export interface HTTPResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  total_count?: string;
  total_page_count?: number;
  current_page?: string;
  gubun?: string;
  body: T;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
