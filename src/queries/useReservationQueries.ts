import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import {
  completeVisit,
  cancelReservation,
  fetchReservations,
  fetchReservationDetail,
  createReservation,
  CreateReservationRequest,
} from "apis/reservation.api"
import { Reservation, ReservationStatusCode } from "types/Reservation"

export interface ReservationDetail extends Reservation {
  services: Array<{
    name: string
    price: number
  }>
  additionalServices?: Array<{
    name: string
    price: number
  }>
  latitude?: number
  longitude?: number
  address?: string
  phone?: string
  branchId: string
  branchName: string
  membershipName: string
  remainingCount: string
  request?: string
  remainingDays?: string
}

export const useUpcomingReservations = () => {
  return useQuery({
    queryKey: ["upcomingReservations"],
    queryFn: () => fetchReservations("001", 1),
    retry: false,
  })
}

export const useReservations = (status: ReservationStatusCode = "000") => {
  return useInfiniteQuery({
    queryKey: ["reservations", status],
    queryFn: ({ pageParam = 1 }) => fetchReservations(status, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Reservation[], pages) => {
      if (lastPage.length === 0) return undefined
      return pages.length + 1
    },
    retry: false,
  })
}

export const useReservationDetail = (reservationId: string) => {
  return useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => fetchReservationDetail(reservationId),
    select: (data) => {
      if (!data) return null

      const detail: ReservationDetail = {
        id: data.r_idx,
        store: data.b_name,
        programName: data.ps_name,
        date: new Date(data.r_date),
        status: data.r_status,
        statusCode: data.r_status_code,
        duration: data.r_take_time || "0:0",
        reviewPositiveYn: data.review_positive_yn,
        visit: Number(data.visit),
        type: data.r_gubun,
        services: [],
        branchId: data.r_idx,
        branchName: data.b_name,
        membershipName: data.s_name,
        remainingCount: data.remain_amount,
        request: data.r_memo,
        remainingDays: "0",
        additionalServices:
          data.add_services?.map((service) => ({
            name: service.s_name,
            price: Number(service.s_price || 0),
          })) || [],
        latitude: Number(data.b_lat),
        longitude: Number(data.b_lon),
        phone: data.b_tel,
      }

      return detail
    },
    retry: false,
  })
}

export const useCompleteVisit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (r_idx: string) => completeVisit(r_idx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservation"] })
    },
    retry: false,
  })
}

interface CancelReservationParams {
  reservationId: string
  cancelMemo: string
}

export const useCancelReservation = () => {
  return useMutation({
    mutationFn: ({ reservationId, cancelMemo }: CancelReservationParams) =>
      cancelReservation(reservationId, cancelMemo),
    retry: false,
  })
}

export const useCreateReservationMutation = () => {
  return useMutation({
    mutationFn: (params: CreateReservationRequest) => createReservation(params),
    retry: false,
  })
}

export const useReservation = (id: number) => {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}

export const useUpdateReservation = () => {
  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
  })
}
