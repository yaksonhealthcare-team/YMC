import { useQuery } from "@tanstack/react-query"
import {
  Reservation,
  ReservationResponse as ApiResponse,
  ReservationStatus,
} from "types/Reservation"
import { axiosClient } from "./clients"

export const useReservations = (status: string = "000") => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations", status],
    queryFn: async () => {
      const { data } = await axiosClient.get("/reservation/reservations", {
        params: {
          r_status: status,
          page: 1,
        },
      })

      if (data.resultCode !== "00" || !data.body || !Array.isArray(data.body)) {
        return []
      }

      return data.body.map((item: ApiResponse) => ({
        id: item.r_idx || "",
        status: item.r_status || "예약완료",
        store: item.b_name || "",
        programName: item.ps_name || "",
        visit: parseInt(item.visit) || 0,
        date: item.r_date
          ? new Date(item.r_date.replace(/-/g, "/"))
          : new Date(),
        remainingDays: item.remaining_days || 0,
        duration: parseInt(item.r_take_time) || 60,
      }))
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

interface AdditionalService {
  mp_idx: string
  service_name: string
  price: string
  service_time: string
}

export interface ReservationDetail {
  id: string
  status: ReservationStatus
  store: string
  programName: string
  visit: number
  date: Date
  duration: number
  request: string
  additionalServices: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
}

export const useReservationDetail = (id: string) => {
  return useQuery<ReservationDetail>({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const { data } = await axiosClient.get("/reservation/detail", {
        params: {
          r_idx: id,
        },
      })

      if (data.resultCode !== "00") {
        throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
      }

      if (
        !data.body ||
        !Array.isArray(data.body) ||
        !data.body[0] ||
        Object.keys(data.body[0]).length <= 1
      ) {
        throw new Error("예약 정보를 찾을 수 없습니다.")
      }

      const body = data.body[0]
      return {
        id: body.r_idx || "",
        status: body.r_status || "예약완료",
        store: body.b_name || "",
        programName: body.ps_name || "",
        visit: parseInt(body.visit) || 0,
        date: body.r_date
          ? new Date(body.r_date.replace(/-/g, "/"))
          : new Date(),
        duration: parseInt(body.r_take_time) || 60,
        request: body.r_memo || "",
        additionalServices:
          body.add_services?.map((service: AdditionalService) => ({
            id: service.mp_idx || "",
            name: service.service_name || "",
            price: parseInt(service.price) || 0,
            duration: parseInt(service.service_time) || 0,
          })) || [],
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  })
}
