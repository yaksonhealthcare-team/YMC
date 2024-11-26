import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { BranchFilters } from "./types/branch.types.ts"
import { queryKeys } from "./query.keys.ts"
import { fetchBranch, fetchBranches } from "../apis/branch.apis.ts"
import { Coordinate } from "../types/Coordinate.ts"

export const useBranches = (filters: BranchFilters) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.branches.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchBranches({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })

export const useBranch = (id: string, coords: Coordinate) =>
  useQuery({
    queryKey: queryKeys.branches.detail(id, coords),
    queryFn: () => fetchBranch(id, coords),
  })
