import { ScheduleDateFilters } from "../types/Schedule.ts"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchScheduleDates } from "../apis/schedule.api.ts"

export const useScheduleDateQueries = (filter: ScheduleDateFilters) =>
  useQuery({
    queryKey: queryKeys.schedules.date(filter),
    queryFn: () => fetchScheduleDates(filter),
    enabled: Boolean(filter.membershipIndex && filter.searchDate),
  })
