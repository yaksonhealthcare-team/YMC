import { useQuery } from "@tanstack/react-query"
import { fetchReservations } from "../apis/reservation.api"

export const useConsultationCount = () => {
  return useQuery({
    queryKey: ["consultationCount"],
    queryFn: async () => {
      const reservations = await fetchReservations("001", 1)
      const completedReservations = await fetchReservations("002", 1)

      const consultationReservations = [
        ...reservations,
        ...completedReservations,
      ].filter((reservation) => reservation.type === "상담예약")

      return Math.min(consultationReservations.length, 2) // 최대 2회로 제한
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시
  })
}
