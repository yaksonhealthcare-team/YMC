import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "./clients"
import { ReservationResponse } from "../types/Reservation"

export const useConsultationCount = () => {
  return useQuery({
    queryKey: ["consultationCount"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/reservation/reservations", {
        params: {
          r_gubun: "C", // 상담 예약만 필터링
          page: 1,
          page_size: 100,
        },
      })

      if (!data.body) return 0

      // 방문완료(002)와 예약완료(001) 상태인 상담 예약만 카운트
      const completedOrConfirmed = data.body.filter(
        (reservation: ReservationResponse) =>
          reservation.r_status === "002" || reservation.r_status === "001",
      )

      return completedOrConfirmed.length
    },
    staleTime: 1000 * 60, // 1분
  })
}
