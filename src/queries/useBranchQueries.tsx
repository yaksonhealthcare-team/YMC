import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  fetchBranches,
  getBranchBookmarks,
  fetchBranch,
  addBranchBookmark,
  removeBranchBookmark,
} from "../apis/branch.api.ts"
import { Coordinate } from "../types/Coordinate.ts"

interface BranchFilters {
  page?: number
  latitude: number
  longitude: number
  brandCode?: string
  category?: string
  search?: string
}

const queryKeys = {
  branches: {
    list: (filters: BranchFilters) => ["branches", filters],
    detail: (b_idx: string, coords: Coordinate) => ["branch", b_idx, coords],
  },
}

export const useBranches = (filters: BranchFilters) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.branches.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchBranches({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.branches.length === 0) return undefined
      return allPages.length + 1
    },
  })

export const useBranch = (b_idx: string, coords: Coordinate) =>
  useQuery({
    queryKey: queryKeys.branches.detail(b_idx, coords),
    queryFn: () => fetchBranch(b_idx, coords),
  })

export const useBranchBookmarksQuery = (coords?: Coordinate) => {
  return useQuery({
    queryKey: ["branchBookmarks", coords],
    queryFn: () => getBranchBookmarks(coords),
    enabled: !!coords,
  })
}

export const useBranchDetailQuery = (b_idx: string) => {
  return useQuery({
    queryKey: ["branchDetail", b_idx],
    queryFn: () => fetchBranch(b_idx, { latitude: 0, longitude: 0 }),
  })
}

export const useBranchBookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => addBranchBookmark(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch"] })
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
  })
}

export const useBranchUnbookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => removeBranchBookmark(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch"] })
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
  })
}
