import { ApiResponse, authApi, CustomUseQueryOptions, handleError } from '@/_shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { GuideMessagesSchema } from '../types';

const BASE_URL = `/guidemessages`;

const getGuideMessages = async (): Promise<AxiosResponse<ApiResponse<GuideMessagesSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/setting`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getGuideMessages');
  }
};
export const useGetGuideMessages = (
  userId: string,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<GuideMessagesSchema[]>>,
    AxiosError,
    ApiResponse<GuideMessagesSchema[]>
  >
) => {
  return useQuery({
    queryKey: ['get-guide-messages', userId],
    queryFn: () => getGuideMessages(),
    select: ({ data }) => data,
    ...options
  });
};
