import { BannerRequestType } from "../types/Banner.ts"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchBanners } from "../apis/banner.api.ts"

export const useBanner = (bannerRequestType: BannerRequestType) =>
  useQuery({
    queryKey: queryKeys.banners.bannerType(bannerRequestType),
    queryFn: () => fetchBanners(bannerRequestType),
  })
