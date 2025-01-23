import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { fetchReservations } from "apis/reservation.api"
import { queryKeys } from "./query.keys"
import { ReservationStatusCode, Reservation } from "types/Reservation"

export const useReservations = (
  status: ReservationStatusCode,
  options?: Omit<UseQueryOptions<Reservation[], Error>, "queryKey" | "queryFn">,
) =>
  useQuery({
    queryKey: queryKeys.reservations.list({
      page: 1,
      status,
    }),
    queryFn: () => fetchReservations(status, 1),
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60 * 1000, // 1분
    staleTime: 30 * 1000, // 30초
    ...options,
  })
