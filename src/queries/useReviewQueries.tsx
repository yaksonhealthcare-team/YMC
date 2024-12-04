import { useInfiniteQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchReviews } from "../apis/review.api.ts"

export const useReviews = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.reviews.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })
