import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"
import { EventStatus } from "../types/Content.ts"

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
  events: {
    all: ["events"] as const,
    list: ({ page, status }: { page: number; status: EventStatus }) =>
      [...queryKeys.events.all, { page, status, infinite: true }] as const,
    detail: (id: string) => [...queryKeys.events.all, id] as const,
  },
  notices: {
    all: ["notices"] as const,
    list: ({ page }: { page: number }) =>
      [...queryKeys.notices.all, { page, infinite: true }] as const,
    detail: (id: string) => [...queryKeys.notices.all, id] as const,
  },
} as const
