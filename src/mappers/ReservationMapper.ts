import dayjs from "dayjs"
import { Reservation, ReservationResponse } from "types/Reservation"

export class ReservationMapper {
  static toReservationEntity = (dto: ReservationResponse): Reservation => {
    return {
      id: dto.r_idx,
      store: dto.b_name,
      date: dayjs(dto.r_date),
      remainingDays: dto.remaining_days,
      visit: parseInt(dto.visit),
      programName: dto.ps_name,
      duration: parseInt(dto.r_take_time),
      status: dto.r_status,
    }
  }

  static toReservationEntities = (
    dtos: ReservationResponse[],
  ): Reservation[] => {
    return dtos.map(this.toReservationEntity)
  }
}
