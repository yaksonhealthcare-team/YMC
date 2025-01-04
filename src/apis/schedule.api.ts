import { ScheduleDate, ScheduleDateFilters } from "../types/Schedule.ts"
import { axiosClient } from "../queries/clients.ts"
import dayjs from "dayjs"

export const fetchScheduleDates = async (
  filters: ScheduleDateFilters,
): Promise<ScheduleDate> => {
  const { data } = await axiosClient.get("/schedules/date", {
    params: {
      mp_idx: filters.membershipIndex,
      add_services:
        filters.addServices && filters.addServices.length > 0
          ? filters.addServices.join(",")
          : null,
      search_date: `${dayjs(filters.searchDate).year()}-${dayjs(filters.searchDate).month() + 1}`,
    },
  })

  return data.body
}
