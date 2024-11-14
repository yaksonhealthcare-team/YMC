import { useQuery } from "@tanstack/react-query"
import { BranchFilters } from "./types/branch.types.ts"
import { queryKeys } from "./query.keys.ts"
import { fetchBranch, fetchBranches } from "../apis/branch.apis.ts"
import { Coordinate } from "../types/Coordinate.ts"

export const useBranches = (filters: BranchFilters) =>
  useQuery({
    queryKey: queryKeys.branches.list(filters),
    queryFn: () => fetchBranches(filters),
  })

export const useBranch = (id: string, coords: Coordinate) =>
  useQuery({
    queryKey: queryKeys.branches.detail(id, coords),
    queryFn: () => fetchBranch(id, coords),
  })
