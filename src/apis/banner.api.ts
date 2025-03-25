import { Banner, BannerResponse, BannerRequestParams } from "../types/Banner.ts"
import { axiosClient } from "../queries/clients.ts"
import { BannerMapper } from "../mappers/BannerMapper.ts"

export const fetchBanners = async (
  params: BannerRequestParams,
): Promise<Banner[]> => {
  const { data } = await axiosClient.get<BannerResponse>("/banners/banners", {
    params,
  })
  return BannerMapper.toEntities(data)
}
