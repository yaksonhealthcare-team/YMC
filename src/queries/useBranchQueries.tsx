import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import {
  bookmarkBranch,
  fetchBranch,
  fetchBranches,
  unbookmarkBranch,
  getBranchBookmarks,
  addBranchBookmark,
  removeBranchBookmark,
} from "../apis/branch.api.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { queryClient } from "./clients.ts"
import { BranchFilters } from "types/Branch.ts"
import { Branch } from "../types/Branch.ts"

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

export const useBranch = (id: string, coords: Coordinate) =>
  useQuery({
    queryKey: queryKeys.branches.detail(id, coords),
    queryFn: () => fetchBranch(id, coords),
  })

export const useBranchBookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => addBranchBookmark(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
  })
}

export const useBranchUnbookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => removeBranchBookmark(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchBookmarks"] })
    },
  })
}

export const useBranchBookmarksQuery = (coords?: Coordinate) => {
  return useQuery({
    queryKey: ["branchBookmarks", coords],
    queryFn: () => getBranchBookmarks(coords),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    enabled: !!coords,
  })
}
