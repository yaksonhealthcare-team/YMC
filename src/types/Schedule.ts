import { Dayjs } from "dayjs"

export interface ScheduleDateFilters {
  membershipIndex?: number
  searchDate?: Dayjs
  addServices?: number[]
}

export interface ScheduleDate {
  dates: string
}
