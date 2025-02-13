import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"
import { EventStatus } from "../types/Content.ts"
import { ReservationStatusCode } from "types/Reservation.ts"
import { BannerRequestType } from "../types/Banner.ts"
import { ScheduleFilters } from "../types/Schedule.ts"

const createQueryKeyFactory = (prefix: string) => ({
  all: () => [prefix] as const,
  detail: (id: string) => [prefix, id] as const,
  list: (params: object) => [prefix, params] as const,
})

const paymentsKeys = createQueryKeyFactory("payments")
const branchesKeys = createQueryKeyFactory("branches")
const schedulesKeys = createQueryKeyFactory("schedules")
const pointsKeys = createQueryKeyFactory("points")

export const queryKeys = {
  payments: {
    all: paymentsKeys.all(),
    histories: ({ page }: { page: number }) =>
      paymentsKeys.list({ page, infinite: true }),
    detail: (id: string) => paymentsKeys.detail(id),
    banks: ["payments", "banks"] as const,
  },
  branches: {
    all: branchesKeys.all(),
    list: (filters: BranchFilters) => branchesKeys.list(filters),
    detail: (id: string, coords: Coordinate) =>
      [...branchesKeys.all(), id, coords] as const,
    map: (coords: Coordinate, brandCode?: string, category?: string) =>
      [...branchesKeys.all(), "maps", coords, brandCode, category] as const,
  },
  schedules: {
    all: schedulesKeys.all(),
    date: (filters: ScheduleFilters) => schedulesKeys.list(filters),
    times: (filters: ScheduleFilters) => schedulesKeys.list(filters),
  },
  points: {
    all: pointsKeys.all(),
    list: (filters: PointFilters) =>
      pointsKeys.list({ ...filters, infinite: true }),
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
    detail: ["brands/detail"] as const,
  },
  memberships: {
    all: ["memberships"] as const,
    list: (brandCode: string, scCode: string) =>
      [...queryKeys.memberships.all, "list", brandCode, scCode] as const,
    detail: (serviceIndex: string) =>
      [...queryKeys.memberships.all, "detail", serviceIndex] as const,
    serviceCategories: (brandCode: string) => [
      ...queryKeys.memberships.all,
      "service_categories",
      brandCode,
    ],
    myList: (status: string) =>
      [...queryKeys.memberships.all, "myList", status] as const,
    additionalManagement: (membershipIdx: number | undefined) =>
      [...queryKeys.memberships.all, "detail", membershipIdx] as const,
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
  reviews: {
    all: ["reviews"] as const,
    list: ({ page }: { page: number }) =>
      [...queryKeys.reviews.all, { page, infinite: true }] as const,
  },
  reservations: {
    all: ["reservations"] as const,
    list: ({ page, status }: { page: number; status: ReservationStatusCode }) =>
      [
        ...queryKeys.reservations.all,
        { page, status, infinite: true },
      ] as const,
  },
  banners: {
    all: ["banners"] as const,
    bannerType: (bannerRequestType: BannerRequestType) =>
      [...queryKeys.banners.all, { bannerRequestType }] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (filters: BranchFilters) =>
      [...queryKeys.notifications.all, filters] as const,
    detail: (id: string, coords: Coordinate) =>
      [...queryKeys.notifications.all, id, coords] as const,
  },
  carts: {
    all: ["carts"] as const,
  },
} as const
