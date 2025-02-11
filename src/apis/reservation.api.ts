import { axiosClient } from "../queries/clients.ts"
import { ReservationMapper } from "mappers/ReservationMapper.ts"
import {
  Reservation,
  ReservationStatusCode,
  ReservationResponse,
} from "types/Reservation.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"

export const fetchReservations = async (
  status: ReservationStatusCode,
  page: number,
): Promise<Reservation[]> => {
  const { data } = await axiosClient.get<HTTPResponse<ReservationResponse[]>>(
    "/reservation/reservations",
    {
      params: {
        r_status: status,
        page,
      },
    },
  )

  if (data.resultCode !== "00") {
    throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
  }

  return ReservationMapper.toReservationEntities(data.body)
}

export const fetchReservationDetail = async (
  id: string,
): Promise<ReservationResponse> => {
  const { data } = await axiosClient.get<HTTPResponse<ReservationResponse[]>>(
    "/reservation/detail",
    {
      params: {
        r_idx: id,
      },
    },
  )

  if (data.resultCode !== "00") {
    throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
  }

  if (!data.body || !Array.isArray(data.body) || !data.body[0]) {
    throw new Error("예약 정보를 찾을 수 없습니다.")
  }

  return data.body[0]
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
