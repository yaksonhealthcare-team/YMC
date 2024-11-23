import { useInfiniteQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchPayments } from "../apis/payments.api.ts"

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
