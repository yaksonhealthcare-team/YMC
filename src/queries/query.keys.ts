import { BranchFilters } from "./types/branch.types.ts"

export const queryKeys = {
  branches: {
    all: ["branches"] as const,
    list: (filters: BranchFilters) => [...queryKeys.branches.all, filters] as const,
  },
} as const
