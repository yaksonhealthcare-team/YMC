import {
  Reservation,
  ReservationResponse,
  ReservationStatus,
  ReservationType,
} from "../types/Reservation"

const statusMap = {
  "000": ReservationStatus.PENDING,
  "001": ReservationStatus.CONFIRMED,
  "002": ReservationStatus.COMPLETED,
  "003": ReservationStatus.CUSTOMER_CANCELLED,
} as const

const typeMap: Record<string, ReservationType> = {
  "1": ReservationType.MANAGEMENT,
  "2": ReservationType.CONSULTATION,
  "3": ReservationType.OTHER,
}

export const ReservationMapper = {
  toReservation: (dto: ReservationResponse): Reservation => {
    return {
      id: dto.r_idx,
      store: dto.b_name,
      date: new Date(dto.r_date),
      status: statusMap[dto.r_status],
      remainingDays: dto.remaining_days,
      visit: parseInt(dto.visit),
      programName: dto.ps_name,
      duration: parseInt(dto.r_take_time),
      type: typeMap[dto.r_gubun] || ReservationType.OTHER,
    }
  },

  toReservationEntities: (dtos: ReservationResponse[]): Reservation[] => {
    return dtos.map(ReservationMapper.toReservation)
  },
}
