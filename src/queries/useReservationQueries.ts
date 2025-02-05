import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import {
  completeVisit,
  cancelReservation,
  fetchReservations,
} from "apis/reservation.api"
import { Reservation, ReservationStatusCode } from "types/Reservation"

export interface ReservationDetail extends Reservation {
  services: Array<{
    name: string
    price: number
  }>
}

export const useUpcomingReservations = () => {
  return useQuery({
    queryKey: ["upcomingReservations"],
    queryFn: () => fetchReservations("001", 1),
  })
}

export const useReservations = (status: ReservationStatusCode = "000") => {
  return useInfiniteQuery({
    queryKey: ["reservations", status],
    queryFn: ({ pageParam = 1 }) => fetchReservations(status, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Reservation[], pages) => {
      if (lastPage.length === 0) return undefined
      return pages.length + 1
    },
  })
}

export const useReservationDetail = (reservationId: string) => {
  return useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () =>
      fetchReservations("000", 1).then((reservations) =>
        reservations.find((r) => r.id === reservationId),
      ),
  })
}

export const useCompleteVisit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      queryClient.invalidateQueries({ queryKey: ["reservation"] })
    },
  })
}

const statusCodeToStatus: Record<ReservationStatusCode, string> = {
  "000": "전체",
  "001": "예약완료",
  "002": "관리완료",
  "003": "예약취소",
}

interface CancelReservationParams {
  reservationId: string
  cancelMemo: string
}

export const useCancelReservation = () => {
  return useMutation({
    mutationFn: ({ reservationId, cancelMemo }: CancelReservationParams) =>
      cancelReservation(reservationId, cancelMemo),
  })
}
