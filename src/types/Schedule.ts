import { Dayjs } from "dayjs"

export interface ScheduleFilters {
  membershipIndex?: number
  searchDate?: Dayjs
  addServices?: number[]
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
