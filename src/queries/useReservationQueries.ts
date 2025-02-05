import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchReservations, completeVisit } from "apis/reservation.api"

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
