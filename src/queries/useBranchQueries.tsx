import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import {
  bookmarkBranch,
  fetchBranch,
  fetchBranches,
  unbookmarkBranch,
} from "../apis/branch.api.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { queryClient } from "./clients.ts"
import { BranchFilters } from "types/Branch.ts"

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

export const useBranchBookmarkMutation = () =>
  useMutation({
    mutationFn: (branchId: string) => bookmarkBranch(branchId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.all,
      })
    },
  })

export const useBranchUnbookmarkMutation = () =>
  useMutation({
    mutationFn: (branchId: string) => unbookmarkBranch(branchId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.all,
      })
    },
  })
