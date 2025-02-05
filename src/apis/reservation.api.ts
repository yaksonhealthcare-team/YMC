import { axiosClient } from "../queries/clients.ts"
import { ReservationMapper } from "mappers/ReservationMapper.ts"
import { Reservation, ReservationStatusCode } from "types/Reservation.ts"

export const fetchReservations = async (
  status: ReservationStatusCode,
  page: number,
): Promise<Reservation[]> => {
  const { data } = await axiosClient.get("/reservation/reservations", {
    params: {
      r_status: status,
      page,
    },
  })

  // BOM 문자 제거 후 파싱
  const cleanData = data.replace(/^\uFEFF/, "")
  const parsedData = JSON.parse(cleanData)

  return ReservationMapper.toReservationEntities(parsedData.body)
}

export const completeVisit = async (reservationId: string): Promise<void> => {
  await axiosClient.post(`/reservation/complete`, {
    r_idx: reservationId,
  })
}

export const cancelReservation = async (
  reservationId: string,
  cancelMemo: string,
): Promise<void> => {
  await axiosClient.delete(`/reservation/reservations`, {
    params: {
      r_idx: reservationId,
      cancel_memo: cancelMemo,
    },
  })
}
