import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchBrand, fetchBrands } from "../apis/brands.api.ts"

export const useBrands = () =>
  useQuery({
    queryKey: queryKeys.brands.all,
    queryFn: fetchBrands,
  })

export const useBrand = (brandCode?: string) =>
  useQuery({
    queryKey: queryKeys.brands.detail,
    queryFn: () => (brandCode ? fetchBrand(brandCode) : Promise.resolve(null)),
  })
