import { authApi } from '@/_shared';
import { BannerMapper } from '@/entities/banner/lib/BannerMapper';
import { Banner, BannerRequestParams, BannerResponse } from '@/entities/banner/model/Banner';

export const fetchBanners = async (params: BannerRequestParams): Promise<Banner[]> => {
  const { data } = await authApi.get<BannerResponse>('/banners/banners', {
    params
  });
  return BannerMapper.toEntities(data);
};
