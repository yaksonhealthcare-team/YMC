import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  getBranchBookmarks,
  fetchBranch,
  addBranchBookmark,
  removeBranchBookmark,
  // fetchBranchCategories,
} from "../apis/branch.api.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { BranchSearchResponse, BranchDetail } from "../types/Branch"
import { axiosClient } from "./clients"

interface BranchFilters {
  page?: number
  latitude?: number
  longitude?: number
  brandCode?: string
  category?: string
  search?: string
  mp_idx?: string
  s_idx?: string
  enabled?: boolean
  isConsultation?: boolean
}

const queryKeys = {
  branches: {
    list: (filters: BranchFilters) => ["branches", filters],
    detail: (b_idx: string, coords: Coordinate) => ["branch", b_idx, coords],
  },
}

export const useBranches = (filters: BranchFilters) =>
  useInfiniteQuery<BranchSearchResponse>({
    initialPageParam: 1,
    queryKey: queryKeys.branches.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosClient.get<BranchSearchResponse>(
        "/branches/branches",
        {
          params: {
            page: pageParam,
            nowlat: filters.latitude,
            nowlon: filters.longitude,
            search: filters.search,
            brand_code: filters.brandCode,
            mp_idx: filters.isConsultation
              ? "상담 예약"
              : filters.mp_idx === "-1"
                ? undefined
                : filters.mp_idx,
            s_idx: filters.s_idx,
            sc_code: filters.category,
          },
        },
      )

      if (data.resultCode !== "00") {
        throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
      }

      return data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.body?.result?.length) return undefined
      if (lastPage.current_page < lastPage.total_page_count) {
        return lastPage.current_page + 1
      }
      return undefined
    },
    retry: true,
    retryDelay: 1000,
    enabled: filters.enabled ?? true,
  })

export const useBranch = (
  b_idx: string,
  coords?: Coordinate,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: queryKeys.branches.detail(
      b_idx,
      coords || { latitude: 0, longitude: 0 },
    ),
    queryFn: () => fetchBranch(b_idx, coords || { latitude: 0, longitude: 0 }),
    retry: false,
    enabled: options?.enabled ?? true,
  })

export const useBranchBookmarksQuery = (key: string, coords?: Coordinate) => {
  return useQuery({
    queryKey: ["branchBookmarks", key, coords],
    queryFn: () => getBranchBookmarks(coords),
    enabled: true,
    retry: false,
  })
}

export const useBranchDetailQuery = (b_idx: string) => {
  return useQuery({
    queryKey: ["branchDetail", b_idx],
    queryFn: () => fetchBranch(b_idx, { latitude: 0, longitude: 0 }),
    retry: false,
  })
}

export const useBranchBookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => addBranchBookmark(branchId),
    onSuccess: (_, branchId) => {
      queryClient.setQueryData<BranchDetail>(
        ["branch", branchId],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            isBookmarked: true,
            favoriteCount: oldData.favoriteCount + 1,
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: ["branch"] })
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
    retry: false,
  })
}

export const useBranchUnbookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => removeBranchBookmark(branchId),
    onSuccess: (_, branchId) => {
      queryClient.setQueryData<BranchDetail>(
        ["branch", branchId],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            isBookmarked: false,
            favoriteCount: Math.max(0, oldData.favoriteCount - 1),
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: ["branch"] })
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
    retry: false,
  })
}

// export const useBranchCategories = (brandCode?: string) => {
//   return useQuery<BranchCategory[], Error>({
//     queryKey: ["branches", "categories", brandCode],
//     queryFn: () => fetchBranchCategories(brandCode),
//     staleTime: 0,
//     gcTime: 0,
//   })
// }
