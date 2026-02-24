import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { earnPoints, fetchPointHistories } from './points.api';
import { queryKeys } from '@/shared/constants/queryKeys/query.keys';

export const usePointHistories = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.points.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchPointHistories({ page: pageParam, sort: 'D' }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined;
      return allPages.length + 1;
    },
    retry: false
  });

export const usePointsEarn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => earnPoints(paymentId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.all
      });
    },
    retry: false
  });
};
