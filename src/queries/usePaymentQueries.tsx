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
  })

export const usePaymentHistory = (paymentId: string) =>
  useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => fetchPayment(paymentId),
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
  })

export const useBankList = () =>
  useQuery({
    queryKey: queryKeys.payments.banks,
    queryFn: () => fetchBankList(),
  })

export const useRequestPayment = () =>
  useMutation({
    mutationFn: (paymentData: PaymentRequest) => requestPayment(paymentData),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.payments] }),
  })
