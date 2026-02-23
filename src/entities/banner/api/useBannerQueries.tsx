import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchBanners } from './banner.api';
import { Banner, BannerRequestParams } from '@/entities/banner/model/Banner';
import { queryKeys } from '@/shared/constants/queryKeys/query.keys';

export const useBanner = (
  params: BannerRequestParams,
  options?: Omit<UseQueryOptions<Banner[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: queryKeys.banners.bannerType(params.gubun),
    queryFn: () => fetchBanners(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options
  });
