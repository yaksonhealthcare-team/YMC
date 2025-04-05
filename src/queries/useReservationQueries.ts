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
import { createUserContextQueryKey } from "../queries/queryKeyFactory"

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
  membershipId?: string
  mp_idx?: string
}

export const useUpcomingReservations = () => {
  return useQuery({
    queryKey: createUserContextQueryKey(["upcomingReservations"]),
    queryFn: () => fetchReservations("001", 1),
    select: (data) => ({
      reservations: data.reservations,
      total_count: data.total_count,
    }),
    retry: false,
  })
}

export const useReservations = (status: ReservationStatusCode = "000") => {
  return useInfiniteQuery({
    queryKey: createUserContextQueryKey(["reservations", status]),
    queryFn: ({ pageParam = 1 }) => fetchReservations(status, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.reservations.length < 10) return undefined
      return pages.length + 1
    },
    retry: false,
  })
}

export const useReservationDetail = (reservationId: string) => {
  return useQuery({
    queryKey: createUserContextQueryKey(["reservationDetail", reservationId]),
    queryFn: () => fetchReservationDetail(reservationId),
    select: (data) => {
      if (!data) return null

      console.log("API Response Data:", data)

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
        branchId: data.b_idx || data.b_name,
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
        address: data.b_addr,
        membershipId: data.mp_idx,
        mp_idx: data.mp_idx,
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
    onSuccess: (_, r_idx) => {
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservationDetail", r_idx]),
      })
    },
    retry: false,
  })
}

interface CancelReservationParams {
  reservationId: string
  cancelMemo: string
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reservationId, cancelMemo }: CancelReservationParams) =>
      cancelReservation(reservationId, cancelMemo),
    retry: false,
    onSuccess: (_, variables) => {
      // 예약 목록과 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations"]),
      })
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey([
          "reservationDetail",
          variables.reservationId,
        ]),
      })
    },
  })
}

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateReservationRequest) => createReservation(params),
    retry: false,
    onSuccess: () => {
      // 예약 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations"]),
      })
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["upcomingReservations"]),
      })
      // 모든 예약 상태에 대한 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations", "000"]), // 전체
      })
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations", "001"]), // 예약완료
      })
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations", "002"]), // 방문완료
      })
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations", "003"]), // 예약취소
      })
    },
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
