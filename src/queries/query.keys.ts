import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"
import { EventStatus } from "../types/Content.ts"
import { ReservationStatusCode } from "types/Reservation.ts"
import { BannerRequestType } from "../types/Banner.ts"
import { ScheduleFilters } from "../types/Schedule.ts"

const createQueryKeys = () => {
  const keys = {
    branches: {
      all: ["branches"] as const,
      list: (filters: BranchFilters) =>
        [...keys.branches.all, filters] as const,
      detail: (id: string, coords: Coordinate) =>
        [...keys.branches.all, id, coords] as const,
      map: (coords: Coordinate, brandCode?: string, category?: string) =>
        [...keys.branches.all, "maps", coords, brandCode, category] as const,
    },
    schedules: {
      all: ["schedules"] as const,
      date: (filters: ScheduleFilters) =>
        [...keys.schedules.all, "date", filters] as const,
      times: (filters: ScheduleFilters) =>
        [...keys.schedules.all, "times", filters] as const,
    },
    points: {
      all: ["points"] as const,
      list: (filters: PointFilters) =>
        [...keys.points.all, { ...filters, infinite: true }] as const,
    },
    payments: {
      all: ["payments"] as const,
      histories: ({ page }: { page: number }) =>
        [...keys.payments.all, { page, infinite: true }] as const,
      detail: (id: string) => [...keys.payments.all, id] as const,
      banks: ["payments", "banks"] as const,
    },
    questionnaires: {
      all: ["questionnaires"] as const,
      questions: (type: "common" | "reservation") =>
        [...keys.questionnaires.all, "questions", type] as const,
      userResult: (type: "general" | "reservation") =>
        [...keys.questionnaires.all, "user_result", type] as const,
    },
    brands: {
      all: ["brands"] as const,
      detail: ["brands/detail"] as const,
    },
    memberships: {
      all: ["memberships"] as const,
      list: (brandCode: string, scCode: string) =>
        [...keys.memberships.all, "list", brandCode, scCode] as const,
      detail: (serviceIndex: string) =>
        [...keys.memberships.all, "detail", serviceIndex] as const,
      serviceCategories: (brandCode: string) => [
        ...keys.memberships.all,
        "service_categories",
        brandCode,
      ],
      myList: (status: string) =>
        [...keys.memberships.all, "myList", status] as const,
      additionalManagement: (membershipIdx: number | undefined) =>
        [...keys.memberships.all, "detail", membershipIdx] as const,
    },
    events: {
      all: ["events"] as const,
      list: ({ page, status }: { page: number; status: EventStatus }) =>
        [...keys.events.all, { page, status, infinite: true }] as const,
      detail: (id: string) => [...keys.events.all, id] as const,
    },
    notices: {
      all: ["notices"] as const,
      list: ({ page }: { page: number }) =>
        [...keys.notices.all, { page, infinite: true }] as const,
      detail: (id: string) => [...keys.notices.all, id] as const,
    },
    reviews: {
      all: ["reviews"] as const,
      list: ({ page }: { page: number }) =>
        [...keys.reviews.all, { page, infinite: true }] as const,
    },
    reservations: {
      all: ["reservations"] as const,
      list: ({
        page,
        status,
      }: {
        page: number
        status: ReservationStatusCode
      }) =>
        [...keys.reservations.all, { page, status, infinite: true }] as const,
    },
    banners: {
      all: ["banners"] as const,
      bannerType: (bannerRequestType: BannerRequestType) =>
        [...keys.banners.all, { bannerRequestType }] as const,
    },
    notifications: {
      all: ["notifications"] as const,
      list: (filters: BranchFilters) =>
        [...keys.notifications.all, filters] as const,
      detail: (id: string, coords: Coordinate) =>
        [...keys.notifications.all, id, coords] as const,
    },
    carts: {
      all: ["carts"] as const,
    },
  } as const

  return keys
}

export const queryKeys = createQueryKeys()
