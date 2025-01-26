import { Dayjs } from "dayjs"

export interface ScheduleFilters {
  membershipIndex?: number
  searchDate?: Dayjs
  addServices?: number[]
  b_idx: string
}

export interface ScheduleDate {
  dates: string
}

export interface ScheduleTime {
  times: string
}

export interface TimeSlot {
  time: string
  code: string
}
