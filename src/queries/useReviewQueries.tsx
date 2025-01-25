import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchReviewDetail, fetchReviews } from "../apis/review.api.ts"

export const useReviews = () => {
  return useInfiniteQuery({
    queryKey: ["reviews"],
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined
      return undefined // 페이지네이션이 필요없으므로 undefined를 반환하여 추가 요청을 방지
    },
  })
}

export const useReviewDetail = (reviewId: string) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => fetchReviewDetail(reviewId),
  })
}
