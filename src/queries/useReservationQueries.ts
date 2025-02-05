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
    queryFn: async () => {
      const reservations = await fetchReservations("000", 1)
      const reservation = reservations.find((r) => r.id === reservationId)
      if (!reservation) return null

      // ReservationDetail로 타입 확장
      return {
        ...reservation,
        services: [], // API에서 받아와야 할 데이터
        branchId: "", // API에서 받아와야 할 데이터
        branchName: reservation.store,
        membershipName: "", // API에서 받아와야 할 데이터
        remainingCount: "0", // API에서 받아와야 할 데이터
      } as ReservationDetail
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
