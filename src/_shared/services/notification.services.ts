import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { GET_UNREAD_COUNT } from '../constants';
import { ApiResponse, CustomUseQueryOptions } from '../types';
import { handleError } from '../utils';
import { authApi } from './instance';

const BASE_URL = `/notifications`;

/**
 * 읽지 않은 알림 갯수 요청
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-7a4b2bb3-5050-4f39-b92c-0daa1643d3da?action=share&source=copy-link&creator=45468383
 */
const getUnreadCount = async (): Promise<AxiosResponse<ApiResponse<Record<'unread_count', string>>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/unread-count`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getUnreadCount');
  }
};
export const useGetUnreadCount = (
  userId: string,
  options: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<Record<'unread_count', string>>>,
    AxiosError,
    AxiosResponse<ApiResponse<Record<'unread_count', string>>>
  >
) => {
  return useQuery({
    queryKey: [GET_UNREAD_COUNT, userId],
    queryFn: () => getUnreadCount(),
    gcTime: 0,
    staleTime: 0,
    ...options
  });
};
