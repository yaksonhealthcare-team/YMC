import { refreshAccessToken } from '@/_domain/auth/services';
import { getAccessToken, removeAccessToken, saveAccessToken } from '@/_domain/auth/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { replace } from 'react-router-dom';
import { ERROR_CODES } from '../constants';
import { ListResponse } from '../types/response.types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  timeoutErrorMessage: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  withCredentials: true // 쿠키 통신을 위해 필요
});

export const publicApi = api.create();
export const authApi = api.create();

authApi.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

authApi.interceptors.response.use(
  async (response: AxiosResponse<ListResponse<[]>>) => {
    const originalRequest = response.config as any;
    const responseData = response?.data;
    const responseStatus = response?.status;
    const isTokenExpired = responseData?.resultCode === ERROR_CODES.TOKEN_EXPIRED;

    if ((isTokenExpired || responseStatus === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        removeAccessToken();
        replace('/login');
        return Promise.reject();
      }

      isRefreshing = true;

      try {
        const { data } = await refreshAccessToken();
        const { accessToken: newAccessToken } = data.body;
        if (!newAccessToken) throw new Error('토큰 갱신 실패');

        saveAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        authApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        return authApi(originalRequest);
      } catch (error) {
        removeAccessToken();
        replace('/login');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  },
  async (error: AxiosError<ListResponse<[]>>) => {
    return Promise.reject(
      new AxiosError('네트워크 에러', undefined, error.config, error.response?.request, error.response)
    );
  }
);
