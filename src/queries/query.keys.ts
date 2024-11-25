import { BranchFilters } from "./types/branch.types.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "./types/point.types.ts"

export const queryKeys = {
  branches: {
    all: ["branches"] as const,
    list: (filters: BranchFilters) =>
      [...queryKeys.branches.all, filters] as const,
    detail: (id: string, coords: Coordinate) =>
      [...queryKeys.branches.all, id, coords] as const,
  },
  points: {
    all: ["points"] as const,
    list: (filters: PointFilters) =>
      [...queryKeys.points.all, { ...filters, infinite: true }] as const,
  },
  questionnaire: {
    common: ["questionnaire", "common"] as const,
    reservation: ["questionnaire", "reservation"] as const,
  },
} as const
