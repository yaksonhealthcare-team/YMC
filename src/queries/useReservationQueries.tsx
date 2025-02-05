import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  Reservation,
  ReservationResponse as ApiResponse,
  ReservationStatus,
  ReservationStatusCode,
} from "types/Reservation"
import { axiosClient } from "./clients"
import { completeVisit } from "apis/reservation.api"

const statusCodeToStatus: Record<ReservationStatusCode, string> = {
  "000": "전체",
  "001": "예약완료",
  "002": "관리완료",
  "003": "예약취소",
}

export const useReservations = (status: string = "000") => {
  return useInfiniteQuery<Reservation[]>({
    queryKey: ["reservations", status],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosClient.get("/reservation/reservations", {
        params: {
          r_status: status,
          page: pageParam,
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
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })
}

export const useUpcomingReservations = (status: string = "001") => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations", "upcoming", status],
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
  branchId: string
  address: string
  latitude: number
  longitude: number
  phone: string
  additionalServices: Array<{
    id: string
    name: string
    price: number
    time: number
  }>
  membershipName: string
  branchName: string
  remainingCount: string
}

export const useReservationDetail = (id: string) => {
  return useQuery<ReservationDetail>({
    queryKey: ["reservation", "detail", id],
    queryFn: async () => {
      const { data } = await axiosClient.get("/reservation/detail", {
        params: {
          r_idx: id,
        },
      })

      if (data.resultCode !== "00") {
        throw new Error(data.resultMessage || "API 오류가 발생했습니다.")
      }

      if (!data.body || !Array.isArray(data.body) || !data.body[0]) {
        throw new Error("예약 정보를 찾을 수 없습니다.")
      }

      const body = data.body[0]
      return {
        id: body.r_idx || id,
        status: body.r_status || ReservationStatus.CONFIRMED,
        store: body.b_name || "",
        programName: body.ps_name || "",
        visit: parseInt(body.visit) || 0,
        date: body.r_date
          ? new Date(body.r_date.replace(/-/g, "/"))
          : new Date(),
        duration: parseInt(body.r_take_time) || 60,
        request: body.r_memo || "",
        branchId: body.b_idx || "",
        address: body.b_addr || "",
        latitude: parseFloat(body.b_lat) || 0,
        longitude: parseFloat(body.b_lon) || 0,
        phone: body.b_tel || "",
        additionalServices:
          body.add_services?.map((service: AdditionalService) => ({
            id: service.mp_idx || "",
            name: service.service_name || "",
            price: parseInt(service.price) || 0,
            time: parseInt(service.service_time) || 0,
          })) || [],
        membershipName: body.membership_name || "",
        branchName: body.b_name || "",
        remainingCount: body.remaining_count || "",
      }
    },
    enabled: !!id,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10, // 10분
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export const useCompleteVisit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      queryClient.invalidateQueries({ queryKey: ["reservation"] })
    },
  })
}
