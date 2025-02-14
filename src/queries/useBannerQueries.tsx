import { BannerRequestType } from "../types/Banner.ts"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchBanners } from "../apis/banner.api.ts"
import { Banner } from "../types/Banner"

export const useBanner = (
  bannerRequestType: BannerRequestType,
  options?: Omit<UseQueryOptions<Banner[], Error>, "queryKey" | "queryFn">,
) =>
  useQuery({
    queryKey: queryKeys.banners.bannerType(bannerRequestType),
    queryFn: () => fetchBanners(bannerRequestType),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  })

// TODO: API 구현 후 수정
export const useBanners = (
  options?: Omit<UseQueryOptions<Banner[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
    ...options,
  })
}
