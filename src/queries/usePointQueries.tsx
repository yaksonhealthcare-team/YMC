import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { earnPoints, fetchPointHistories } from '../apis/points.api';
import { queryClient } from './clients';
import { queryKeys } from './query.keys';

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

export const usePointsEarn = () =>
  useMutation({
    mutationFn: (paymentId: string) => earnPoints(paymentId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.all
      });
    },
    retry: false
  });

export const usePointHistory = () => {
  return useInfiniteQuery({
    queryKey: ['points', 'history'],
    queryFn: ({ pageParam = 1 }) => fetchPointHistories({ page: pageParam, sort: 'D' }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.length || lastPage.currentPage >= lastPage.totalPage) return undefined;
      return lastPage.currentPage + 1;
    },
    retry: false
  });
};

export const useUsePoint = () => {
  return useMutation({
    mutationFn: earnPoints,
    retry: false
  });
};
