import { Banner, BannerRequestType, BannerResponse } from "../types/Banner.ts"
import { axiosClient } from "../queries/clients.ts"
import { BannerMapper } from "../mappers/BannerMapper.ts"

export const fetchBanners = async (
  bannerRequestType: BannerRequestType,
): Promise<Banner[]> => {
  const { data } = await axiosClient.get<BannerResponse>("/banners/banners", {
    params: {
      gubun: bannerRequestType,
    },
  })
  return BannerMapper.toEntities(data)
}
