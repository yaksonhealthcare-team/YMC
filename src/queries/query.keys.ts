import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"

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
  payments: {
    all: ["payments"] as const,
    histories: ({ page }: { page: number }) =>
      [...queryKeys.payments.all, { page: page, infinite: true }] as const,
  },
  questionnaires: {
    all: ["questionnaires"] as const,
    questions: (type: "common" | "reservation") =>
      [...queryKeys.questionnaires.all, "questions", type] as const,
    userResult: (type: "general" | "reservation") =>
      [...queryKeys.questionnaires.all, "user_result", type] as const,
  },
  brands: {
    all: ["brands"] as const,
  },
  memberships: {
    all: ["memberships"] as const,
    list: (brandCode: string, scCode: string) =>
      [...queryKeys.memberships.all, "list", brandCode, scCode] as const,
    serviceCategories: (brandCode: string) => [
      ...queryKeys.memberships.all,
      "service_categories",
      brandCode,
    ],
  },
} as const
