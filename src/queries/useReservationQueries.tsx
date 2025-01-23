import { useQuery } from "@tanstack/react-query"
import {
  Reservation,
  ReservationResponse as ApiResponse,
  ReservationStatus,
} from "types/Reservation"
import { axiosClient } from "./clients"

export const useReservations = (status: string = "000") => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations", status],
    queryFn: async () => {
      const { data } = await axiosClient.get("/reservation/reservations", {
        params: {
          r_status: status,
          page: 1,
        },
      })

      return data.body.map((item: ApiResponse) => ({
        id: item.r_idx,
        status: item.r_status,
        store: item.b_name,
        programName: item.ps_name,
        visit: parseInt(item.visit),
        date: new Date(item.r_date),
        remainingDays: item.remaining_days,
        duration: parseInt(item.r_take_time),
      }))
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
