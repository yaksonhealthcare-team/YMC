import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelPayments, fetchPayment, fetchPayments } from '../apis/payments.api';
import { PaymentHistory } from '../types/Payment';
import { queryKeys } from './query.keys';

export const usePaymentHistories = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.payments.histories.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchPayments({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }

      const currentPage = allPages.length;
      const totalPageCount = (lastPage as PaymentHistory[] & { totalPageCount: number }).totalPageCount;

      if (currentPage >= totalPageCount) {
        return undefined;
      }

      return currentPage + 1;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

export const usePaymentHistory = (paymentId: string) =>
  useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => fetchPayment(paymentId),
    retry: false
  });

export const usePaymentCancel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentIds, reason }: { orderId: string; paymentIds: string[]; reason: string }) =>
      cancelPayments(orderId, paymentIds, reason),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.histories.list({ page: 1 }),
        exact: true
      }),
    retry: false
  });
};
