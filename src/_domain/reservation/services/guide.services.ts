import { ApiResponse, authApi, CustomUseQueryOptions, handleError } from '@/_shared';
import { AxiosError, AxiosResponse } from 'axios';
import { GuideMessagesSchema } from '../types';
import { useQuery } from '@tanstack/react-query';

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
  key: string,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<GuideMessagesSchema[]>>,
    AxiosError,
    ApiResponse<GuideMessagesSchema[]>
  >
) => {
  return useQuery({
    queryKey: ['get-guide-messages', key],
    queryFn: () => getGuideMessages(),
    select: ({ data }) => data,
    ...options
  });
};
