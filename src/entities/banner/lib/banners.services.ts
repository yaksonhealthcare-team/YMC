import { authApi } from '@/shared/api/instance';
import { GET_BANNERS } from '@/shared/constants/queryKeys/queryKey.constants';
import { handleError } from '@/shared/lib/utils/error.utils';
import { CustomUseQueryOptions } from '@/shared/types/util.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { BannerParams, BannerResponse } from '@/entities/banner/model/banners.types';

const BASE_URL = `/banners`;

/**
 * 배너 조회
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-4eac1d4f-decd-4e2b-a2fd-c5924f7de538?action=share&source=copy-link&creator=45468383
 */
const getBanners = async (params: BannerParams): Promise<AxiosResponse<BannerResponse, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/banners`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBanners');
  }
};
export const useGetBanners = (
  userId: string,
  params: BannerParams,
  options?: CustomUseQueryOptions<AxiosResponse<BannerResponse>, AxiosError, AxiosResponse<BannerResponse>>
) => {
  return useQuery({
    queryKey: [GET_BANNERS, userId, params],
    queryFn: () => getBanners(params),
    ...options
  });
};
