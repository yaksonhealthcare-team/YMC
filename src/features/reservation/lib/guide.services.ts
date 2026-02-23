import { authApi } from '@/shared/api/instance';
import { GET_GUIDE_MESSAGES } from '@/shared/constants/queryKeys/queryKey.constants';
import { handleError } from '@/shared/lib/utils/error.utils';
import { ApiResponse } from '@/shared/types/response.types';
import { CustomUseQueryOptions } from '@/shared/types/util.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { GuideMessagesSchema } from '@/entities/reservation/model/guide.types';

const BASE_URL = `/guidemessages`;

/**
 * setting 안내문구 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-c821ba92-8e3a-4834-b449-2368105708f7?action=share&source=copy-link&creator=45468383
 */
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
    queryKey: [GET_GUIDE_MESSAGES, userId],
    queryFn: () => getGuideMessages(),
    select: ({ data }) => data,
    gcTime: 1000 * 60 * 20,
    staleTime: 1000 * 60 * 10,
    ...options
  });
};
