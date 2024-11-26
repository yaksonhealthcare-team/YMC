import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchBrands } from "../apis/brands.api.ts"

export const useBrands = () =>
  useQuery({
    queryKey: queryKeys.brands.all,
    queryFn: fetchBrands,
  })
