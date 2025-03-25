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
    queryKey: queryKeys.payments.histories.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchPayments({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.histories.list({ page: 1 }),
        exact: true,
      }),
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.histories.list({ page: 1 }),
        exact: true,
      }),
    retry: false,
  })

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
  })
}

export const usePaymentByReservation = (reservationId: number) => {
  return useQuery({
    queryKey: ["payments", "reservation", reservationId],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}

export const useCancelPayment = () => {
  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
  })
}
