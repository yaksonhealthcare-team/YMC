import { CustomUseQueryOptions } from '@/_shared';
import { BannerParams } from '../../types/banners.type';
import { AxiosError, AxiosResponse } from 'axios';
import { BannerResponse, getBanners } from '../banners.services';
import { useQuery } from '@tanstack/react-query';

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
