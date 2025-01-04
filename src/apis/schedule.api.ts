import {
  ScheduleDate,
  ScheduleFilters,
  ScheduleTime,
} from "../types/Schedule.ts"
import { axiosClient } from "../queries/clients.ts"
import dayjs from "dayjs"

export const fetchScheduleDates = async (
  filters: ScheduleFilters,
): Promise<ScheduleDate> => {
  const { data } = await axiosClient.get("/schedules/date", {
    params: {
      mp_idx: filters.membershipIndex,
      add_services:
        filters.addServices && filters.addServices.length > 0
          ? filters.addServices.join(",")
          : null,
      search_date: dayjs(filters.searchDate).format("YYYY-MM"),
    },
  })

  return data.body
}

export const fetchScheduleTimes = async (
  filters: ScheduleFilters,
): Promise<ScheduleTime> => {
  const { data } = await axiosClient.get("/schedules/times", {
    params: {
      mp_idx: filters.membershipIndex,
      add_services:
        filters.addServices && filters.addServices.length > 0
          ? filters.addServices.join(",")
          : null,
      search_date: dayjs(filters.searchDate).format("YYYY-MM-DD"),
    },
  })

  return data.body
}
