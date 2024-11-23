import { useInfiniteQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchPointHistories } from "../apis/points.api.ts"

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
  })
