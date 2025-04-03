import { AdditionalManagement } from "./Membership"
import { TimeSlot } from "./TimeSlot"
import { Dayjs } from "dayjs"

export type ReservationStatusCode =
  | "000" // 전체
  | "001" // 예약완료
  | "002" // 방문완료
  | "003" // 예약취소
  | "008" // 관리중

export const ReservationStatus = {
  COMPLETED: "000",
  CONFIRMED: "001",
  PENDING: "002",
  CUSTOMER_CANCELLED: "003",
  STORE_CANCELLED: "003",
  IN_PROGRESS: "001",
  NO_SHOW: "003",
} as const

export type ReservationStatus =
  (typeof ReservationStatus)[keyof typeof ReservationStatus]

export const ReservationStatusLabel = {
  "000": "관리완료",
  "001": "예약완료",
  "002": "대기예약",
  "003": "예약취소",
  "008": "관리중",
} as const

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
  status: string
  statusCode: ReservationStatusCode
  duration?: string
  visit: number
  type: string
  remainingDays?: string
  reviewPositiveYn?: string
  branchId: string
}

export interface ReservationResponse {
  r_idx: string
  r_gubun: string
  b_idx: string
  b_name: string
  b_lat: string
  b_lon: string
  b_tel: string
  b_addr: string
  r_date: string
  p_idx: string
  mp_idx?: string // 회원권 식별자
  ps_name: string
  r_take_time: string
  visit: string
  r_status: ReservationStatusCode
  r_status_code: ReservationStatusCode
  r_memo: string
  s_name: string
  buy_amount: string
  remain_amount: string
  remaining_days: string
  review_positive_yn?: string
  add_services: Array<{
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

export interface FormDataType {
  branch: string
  item: string | null
  date: Dayjs | null
  timeSlot: TimeSlot | null
  request: string
  additionalServices: AdditionalManagement[]
}
