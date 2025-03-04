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

export const completeVisit = async (r_idx: string): Promise<void> => {
  const { data } = await axiosClient.post<HTTPResponse<null>>(
    "/reservation/complete",
    {
      r_idx,
    },
  )

  if (data.resultCode !== "00") {
    throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
  }
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

export interface CreateReservationRequest {
  r_gubun: "R" | "C" // 예약(R) 상담(C)
  mp_idx?: string // 회원권 식별자 (일반 예약시에만 필요)
  b_idx?: string // 지점 식별자 (지정지점인 경우에만 필요)
  r_date: string // 예약 일자
  r_stime: string // 예약 시간
  add_services?: number[] // 추가관리 옵션 식별자 목록
  r_memo?: string // 요청사항
}

interface CreateReservationResponse {
  r_idx: string // 예약 식별자
}

export const createReservation = async (params: CreateReservationRequest) => {
  const { data } = await axiosClient.post<
    HTTPResponse<CreateReservationResponse>
  >("/reservation/reservations", params)
  return data
}

export const getConsultationCount = async (): Promise<{
  currentCount: number
  maxCount: number
}> => {
  const { data } = await axiosClient.get<
    HTTPResponse<{
      current_count: string
      consultation_max_count: string
    }>
  >("/reservation/consultation-count")

  if (data.resultCode !== "00") {
    throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
  }

  return {
    currentCount: Number(data.body?.current_count ?? 0),
    maxCount: Number(data.body?.consultation_max_count ?? 0),
  }
}
