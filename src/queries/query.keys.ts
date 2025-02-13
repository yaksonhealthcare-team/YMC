import { BranchFilters } from "types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { PointFilters } from "types/Point.ts"
import { EventStatus } from "../types/Content.ts"
import { ReservationStatusCode } from "types/Reservation.ts"
import { BannerRequestType } from "../types/Banner.ts"
import { ScheduleFilters } from "../types/Schedule.ts"

const createQueryKeys = () =>
  ({
    branches: {
      all: ["branches"] as const,
      list: (filters: BranchFilters) =>
        [...createQueryKeys().branches.all, filters] as const,
      detail: (id: string, coords: Coordinate) =>
        [...createQueryKeys().branches.all, id, coords] as const,
      map: (coords: Coordinate, brandCode?: string, category?: string) =>
        [
          ...createQueryKeys().branches.all,
          "maps",
          coords,
          brandCode,
          category,
        ] as const,
    },
    schedules: {
      all: ["schedules"] as const,
      date: (filters: ScheduleFilters) =>
        [...createQueryKeys().schedules.all, "date", filters] as const,
      times: (filters: ScheduleFilters) =>
        [...createQueryKeys().schedules.all, "times", filters] as const,
    },
    points: {
      all: ["points"] as const,
      list: (filters: PointFilters) =>
        [
          ...createQueryKeys().points.all,
          { ...filters, infinite: true },
        ] as const,
    },
    payments: {
      all: ["payments"] as const,
      histories: ({ page }: { page: number }) =>
        [...createQueryKeys().payments.all, { page, infinite: true }] as const,
      detail: (id: string) => [...createQueryKeys().payments.all, id] as const,
      banks: ["payments", "banks"] as const,
    },
    questionnaires: {
      all: ["questionnaires"] as const,
      questions: (type: "common" | "reservation") =>
        [...createQueryKeys().questionnaires.all, "questions", type] as const,
      userResult: (type: "general" | "reservation") =>
        [...createQueryKeys().questionnaires.all, "user_result", type] as const,
    },
    brands: {
      all: ["brands"] as const,
      detail: ["brands/detail"] as const,
    },
    memberships: {
      all: ["memberships"] as const,
      list: (brandCode: string, scCode: string) =>
        [
          ...createQueryKeys().memberships.all,
          "list",
          brandCode,
          scCode,
        ] as const,
      detail: (serviceIndex: string) =>
        [...createQueryKeys().memberships.all, "detail", serviceIndex] as const,
      serviceCategories: (brandCode: string) => [
        ...createQueryKeys().memberships.all,
        "service_categories",
        brandCode,
      ],
      myList: (status: string) =>
        [...createQueryKeys().memberships.all, "myList", status] as const,
      additionalManagement: (membershipIdx: number | undefined) =>
        [
          ...createQueryKeys().memberships.all,
          "detail",
          membershipIdx,
        ] as const,
    },
    events: {
      all: ["events"] as const,
      list: ({ page, status }: { page: number; status: EventStatus }) =>
        [
          ...createQueryKeys().events.all,
          { page, status, infinite: true },
        ] as const,
      detail: (id: string) => [...createQueryKeys().events.all, id] as const,
    },
    notices: {
      all: ["notices"] as const,
      list: ({ page }: { page: number }) =>
        [...createQueryKeys().notices.all, { page, infinite: true }] as const,
      detail: (id: string) => [...createQueryKeys().notices.all, id] as const,
    },
    reviews: {
      all: ["reviews"] as const,
      list: ({ page }: { page: number }) =>
        [...createQueryKeys().reviews.all, { page, infinite: true }] as const,
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
        [
          ...createQueryKeys().reservations.all,
          { page, status, infinite: true },
        ] as const,
    },
    banners: {
      all: ["banners"] as const,
      bannerType: (bannerRequestType: BannerRequestType) =>
        [...createQueryKeys().banners.all, { bannerRequestType }] as const,
    },
    notifications: {
      all: ["notifications"] as const,
      list: (filters: BranchFilters) =>
        [...createQueryKeys().notifications.all, filters] as const,
      detail: (id: string, coords: Coordinate) =>
        [...createQueryKeys().notifications.all, id, coords] as const,
    },
    carts: {
      all: ["carts"] as const,
    },
  }) as const

export const queryKeys = createQueryKeys()
