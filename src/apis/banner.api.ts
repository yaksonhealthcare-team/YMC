import { authApi } from '@/_shared';
import { BannerMapper } from '@/mappers/BannerMapper';
import { Banner, BannerRequestParams, BannerResponse } from '@/types/Banner';

export const fetchBanners = async (params: BannerRequestParams): Promise<Banner[]> => {
  const { data } = await authApi.get<BannerResponse>('/banners/banners', {
    params
  });
  return BannerMapper.toEntities(data);
};
