import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchReservations,
  completeVisit,
  getReservationDetail,
  cancelReservation,
} from "apis/reservation.api"

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
