import { useQuery } from "@tanstack/react-query"
import { BranchFilters } from "./types/branch.types.ts"
import { queryKeys } from "./query.keys.ts"
import { fetchBranches } from "../apis/branch.apis.ts"

export const useBranches = (filters: BranchFilters) => useQuery({
  queryKey: queryKeys.branches.list(filters),
  queryFn: () => fetchBranches(filters),
})

