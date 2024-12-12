import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchReservations } from "apis/reservation.api"
import { queryKeys } from "./query.keys"
import { ReservationStatusCode } from "types/Reservation"

export const useReservations = (status: ReservationStatusCode) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.reservations.list({
      page: 1,
      status,
    }),
    queryFn: ({ pageParam = 1 }) => fetchReservations(status, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })
