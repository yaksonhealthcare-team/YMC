import { authApi, CustomUseQueryOptions, handleError } from '@/_shared';
import { BannerParams, BannerResponse } from '../types/banners.types';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';

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
  key: string,
  params: BannerParams,
  options?: CustomUseQueryOptions<AxiosResponse<BannerResponse>, AxiosError, AxiosResponse<BannerResponse>>
) => {
  return useQuery({
    queryKey: [key, params, 'get-banners'],
    queryFn: () => getBanners(params),
    ...options
  });
};
