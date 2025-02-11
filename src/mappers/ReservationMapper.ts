import {
  Reservation,
  ReservationResponse,
  ReservationType,
} from "../types/Reservation"

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
      status: dto.r_status,
      remainingDays: dto.remain_amount,
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
