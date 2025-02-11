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

export enum ReservationType {
  MANAGEMENT = "관리예약",
  CONSULTATION = "상담예약",
  OTHER = "기타예약",
}

export interface Reservation {
  id: string
  store: string
  programName: string
  date: Date
  status: ReservationStatusCode
  duration: string
  visit: number
  type: string
  remainingDays?: string
}

export interface ReservationResponse {
  r_idx: string
  b_name: string
  ps_name: string
  r_date: string
  r_status: ReservationStatusCode
  r_time: string
  r_visit: number
  r_gubun: string
  b_idx: string
  mp_name?: string
  mp_remain?: string
  r_memo?: string
  additional_services?: Array<{
    s_name: string
    s_price: string
  }>
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
