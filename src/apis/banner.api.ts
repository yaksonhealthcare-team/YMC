import { BannerMapper } from '@/mappers/BannerMapper';
import { axiosClient } from '@/queries/clients';
import { Banner, BannerRequestParams, BannerResponse } from '@/types/Banner';

export const fetchBanners = async (params: BannerRequestParams): Promise<Banner[]> => {
  const { data } = await axiosClient.get<BannerResponse>('/banners/banners', {
    params
  });
  return BannerMapper.toEntities(data);
};
