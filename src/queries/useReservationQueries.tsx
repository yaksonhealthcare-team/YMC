import { useMutation } from "@tanstack/react-query"
import { createReservation } from "../apis/reservation.api"
import type { CreateReservationRequest } from "../apis/reservation.api"

export const useCreateReservationMutation = () => {
  return useMutation({
    mutationFn: (params: CreateReservationRequest) => createReservation(params),
  })
}
