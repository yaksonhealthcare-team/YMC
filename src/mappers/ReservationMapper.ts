import {
  Reservation,
  ReservationResponse,
  ReservationType,
  ReservationStatusCode,
} from "../types/Reservation"

const typeMap: Record<string, ReservationType> = {
  "1": ReservationType.MANAGEMENT,
  "2": ReservationType.CONSULTATION,
  "3": ReservationType.OTHER,
}

const statusMap: Record<string, ReservationStatusCode> = {
  "관리완료": "000",
  "예약완료": "001",
  "방문완료": "002",
  "예약취소": "003",
  "매장취소": "003",
  "미방문": "003",
  "고객취소": "003",
  "관리중": "008",
}

export const ReservationMapper = {
  toReservation: (dto: ReservationResponse): Reservation => {
    return {
      id: dto.r_idx,
      store: dto.b_name,
      date: new Date(dto.r_date),
      status: statusMap[dto.r_status] || "000",
      remainingDays: dto.remaining_days,
      visit: parseInt(dto.visit),
      programName: dto.ps_name,
      duration: dto.r_take_time,
      type: typeMap[dto.r_gubun] || ReservationType.OTHER,
    }
  },

  toReservationEntities: (dtos: ReservationResponse[]): Reservation[] => {
    return dtos.map(ReservationMapper.toReservation)
  },
}
