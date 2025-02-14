import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { earnPoints, fetchPointHistories } from "../apis/points.api.ts"
import { queryClient } from "./clients.ts"

export const usePointHistories = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.points.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) =>
      fetchPointHistories({ page: pageParam, sort: "D" }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined
      return allPages.length + 1
    },
    retry: false,
  })

export const usePointsEarn = () =>
  useMutation({
    mutationFn: (paymentId: string) => earnPoints(paymentId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.all,
      })
    },
    retry: false,
  })

export const usePointHistory = () => {
  return useInfiniteQuery({
    queryKey: ["points", "history"],
    queryFn: getPointHistory,
    retry: false,
  })
}

export const useUsePoint = () => {
  return useMutation({
    mutationFn: usePoint,
    retry: false,
  })
}
