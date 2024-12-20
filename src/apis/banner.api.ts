import { Banner, BannerRequestType } from "../types/Banner.ts"
import { axiosClient } from "../queries/clients.ts"
import { BannerMapper } from "../mappers/BannerMapper.ts"

export const fetchBanners = async (
  bannerRequestType: BannerRequestType,
): Promise<Banner[]> => {
  const { data } = await axiosClient.get("/banners/banners", {
    params: {
      gubun: bannerRequestType,
    },
  })
  return BannerMapper.toEntities(data.body)
}
