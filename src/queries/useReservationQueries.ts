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
        duration: data.r_time,
        visit: data.r_visit,
        type: data.r_gubun,
        services: [],
        branchId: data.b_idx || "",
        branchName: data.b_name,
        membershipName: data.mp_name || "",
        remainingCount: data.mp_remain || "0",
        request: data.r_memo,
        remainingDays: "0",
        additionalServices:
          data.additional_services?.map((service) => ({
            name: service.s_name,
            price: Number(service.s_price || 0),
          })) || [],
      }

      return detail
    },
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

interface CancelReservationParams {
  reservationId: string
  cancelMemo: string
}

export const useCancelReservation = () => {
  return useMutation({
    mutationFn: ({ reservationId, cancelMemo }: CancelReservationParams) =>
      cancelReservation(reservationId, cancelMemo),
  })
}
