import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchBanners } from '../apis/banner.api';
import { Banner, BannerRequestParams } from '../types/Banner';
import { queryKeys } from './query.keys';

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
