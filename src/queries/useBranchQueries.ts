import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosClient } from "./clients"
import { BranchSearchResponse } from "../types/Branch"

interface BranchFilters {
  latitude?: number
  longitude?: number
  search?: string
}

export const useBranches = (filters: BranchFilters) => {
  return useInfiniteQuery<BranchSearchResponse>({
    queryKey: ["branches", filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosClient.get<BranchSearchResponse>(
        "/branches/branches",
        {
          params: {
            page: pageParam,
            nowlat: filters.latitude,
            nowlon: filters.longitude,
            search: filters.search,
          },
        },
      )
      return data
    },
    getNextPageParam: (lastPage: BranchSearchResponse) => {
      if (lastPage.current_page < lastPage.total_page_count) {
        return lastPage.current_page + 1
      }
      return undefined
    },
  })
}
