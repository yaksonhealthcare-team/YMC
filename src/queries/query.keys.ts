import { BranchFilters } from "./types/branch.types.ts"
import { Coordinate } from "../types/Coordinate.ts"

export const queryKeys = {
  branches: {
    all: ["branches"] as const,
    list: (filters: BranchFilters) =>
      [...queryKeys.branches.all, filters] as const,
    detail: (id: string, coords: Coordinate) =>
      [...queryKeys.branches.all, id, coords] as const,
  },
  questionnaires: {
    all: ["questionnaires"] as const,
    userResult: (type: "general" | "reservation") =>
      [...queryKeys.questionnaires.all, "user_result", type] as const,
  },
} as const
