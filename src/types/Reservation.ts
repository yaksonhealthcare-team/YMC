export type ReservationStatusCode = "000" | "001" | "002" | "003"

export enum ReservationStatus {
  COMPLETED = "관리완료",
  IN_PROGRESS = "관리중",
  CONFIRMED = "예약완료",
  APPROVED = "승인예약",
  PENDING = "대기예약",
  CUSTOMER_CANCELLED = "고객취소",
  STORE_CANCELLED = "매장취소",
  NO_SHOW = "미방문",
}

export interface Reservation {
  id: string
  store: string
  date: Date
  remainingDays: string
  visit: number
  programName: string
  duration: number
  status: ReservationStatus
}

export interface ReservationResponse {
  r_idx: string
  b_name: string
  r_date: string
  r_status: ReservationStatus
  remaining_days: string
  visit: string
  ps_name: string
  r_take_time: string
}

export interface FilterItem {
  id: ReservationStatusCode
  title: string
}

export const reservationFilters: FilterItem[] = [
  {
    id: "000",
    title: "전체",
  },
  {
    id: "001",
    title: "방문예정",
  },
  {
    id: "002",
    title: "방문완료",
  },
  {
    id: "003",
    title: "예약취소",
  },
]
