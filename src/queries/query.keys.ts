import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"
import { EventStatus } from "../types/Content.ts"
import { ReservationStatusCode } from "types/Reservation.ts"
import { BannerRequestType } from "../types/Banner.ts"

export const queryKeys = {
  branches: {
    all: ["branches"] as const,
    list: (filters: BranchFilters) =>
      [...queryKeys.branches.all, filters] as const,
    detail: (id: string, coords: Coordinate) =>
      [...queryKeys.branches.all, id, coords] as const,
    map: (coords: Coordinate, brandCode?: string, category?: string) => [
      ...queryKeys.branches.all,
      "maps",
      coords,
      brandCode,
      category,
    ],
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
    detail: (id: string) => [...queryKeys.payments.all, id] as const,
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
} as const
