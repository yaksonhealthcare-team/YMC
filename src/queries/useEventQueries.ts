import { useQuery } from "@tanstack/react-query"
import { fetchEvents, fetchEventDetail } from "apis/contents.api"

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

export const useEventDetail = (code: string) => {
  return useQuery({
    queryKey: ["event", code],
    queryFn: () => fetchEventDetail(code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
