export enum ReservationStatus {
  UPCOMING = "UPCOMING", // 방문예정
  CANCELLED = "CANCELLED", // 예약취소
  IN_PROGRESS = "IN_PROGRESS", // 방문시간 진행중
  COMPLETED = "COMPLETED", // 방문완료
  COUNSELING_CONFIRMED = "COUNSELING_CONFIRMED", // 상담예약 확정
}

export const reservationStatusLabel: Record<ReservationStatus, string> = {
  [ReservationStatus.UPCOMING]: "방문예정",
  [ReservationStatus.CANCELLED]: "예약취소",
  [ReservationStatus.IN_PROGRESS]: "방문예정",
  [ReservationStatus.COMPLETED]: "방문완료",
  [ReservationStatus.COUNSELING_CONFIRMED]: "방문예정",
}

export type ReservationItem = {
  id: number
  status: ReservationStatus
  store: string
  title: string
  count: number
  date: Date
  dDay?: number
}

export type ReservationFilterId = "all" | ReservationStatus

export const reservationFilters = [
  { id: "all", title: "전체" },
  {
    id: ReservationStatus.UPCOMING,
    title: reservationStatusLabel[ReservationStatus.UPCOMING],
  },
  {
    id: ReservationStatus.COMPLETED,
    title: reservationStatusLabel[ReservationStatus.COMPLETED],
  },
  {
    id: ReservationStatus.CANCELLED,
    title: reservationStatusLabel[ReservationStatus.CANCELLED],
  },
] as const
