import { ScheduleFilters } from "../types/Schedule.ts"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchScheduleDates, fetchScheduleTimes } from "../apis/schedule.api.ts"

export const useScheduleDateQueries = (filter: ScheduleFilters) =>
  useQuery({
    queryKey: queryKeys.schedules.date(filter),
    queryFn: () => fetchScheduleDates(filter),
    enabled: Boolean(filter.membershipIndex && filter.searchDate),
  })

export const useScheduleTimesQueries = (filter: ScheduleFilters) =>
  useQuery({
    queryKey: queryKeys.schedules.times(filter),
    queryFn: () => fetchScheduleTimes(filter),
    enabled: Boolean(filter.membershipIndex && filter.searchDate),
  })
