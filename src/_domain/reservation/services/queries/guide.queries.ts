import { ApiResponse, CustomUseQueryOptions } from '@/_shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { GuideMessagesSchema } from '../../types';
import { getGuideMessages } from '../guide.services';

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
