import { BannerRequestParams } from "../types/Banner.ts"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchBanners } from "../apis/banner.api.ts"
import { Banner } from "../types/Banner"

export const useBanner = (
  params: BannerRequestParams,
  options?: Omit<UseQueryOptions<Banner[], Error>, "queryKey" | "queryFn">,
) =>
  useQuery({
    queryKey: queryKeys.banners.bannerType(params.gubun),
    queryFn: () => fetchBanners(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  })

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
