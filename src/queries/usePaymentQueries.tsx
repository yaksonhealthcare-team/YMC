import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import {
  cancelPayments,
  fetchPayment,
  fetchPayments,
  fetchBankList,
  requestPayment,
} from "../apis/payments.api.ts"
import { PaymentRequest } from "../types/Payment.ts"
import { queryClient } from "./clients.ts"

export const usePaymentHistories = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.payments.histories({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchPayments({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    retry: false,
  })

export const usePaymentHistory = (paymentId: string) =>
  useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => fetchPayment(paymentId),
    retry: false,
  })

export const usePaymentCancel = () =>
  useMutation({
    mutationFn: ({
      orderId,
      paymentIds,
      reason,
    }: {
      orderId: string
      paymentIds: string[]
      reason: string
    }) => cancelPayments(orderId, paymentIds, reason),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.payments] }),
    retry: false,
  })

export const useBankList = () =>
  useQuery({
    queryKey: queryKeys.payments.banks,
    queryFn: () => fetchBankList(),
    retry: false,
  })

export const useRequestPayment = () =>
  useMutation({
    mutationFn: (paymentData: PaymentRequest) => requestPayment(paymentData),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.payments] }),
    retry: false,
  })

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPayment(id),
    retry: false,
  })
}

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: createPayment,
    retry: false,
  })
}

export const usePaymentByReservation = (reservationId: number) => {
  return useQuery({
    queryKey: ["payments", "reservation", reservationId],
    queryFn: () => getPaymentByReservation(reservationId),
    retry: false,
  })
}

export const useCancelPayment = () => {
  return useMutation({
    mutationFn: cancelPayment,
    retry: false,
  })
}
