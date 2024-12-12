import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { ReservationMapper } from "mappers/ReservationMapper.ts"
import {
  Reservation,
  ReservationResponse,
  ReservationStatusCode,
} from "types/Reservation.ts"

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

  return ReservationMapper.toReservationEntities(data.body)
}
