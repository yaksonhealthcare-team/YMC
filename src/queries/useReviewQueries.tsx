import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query"
import {
  CreateReviewRequest,
  createReview,
  fetchReviewDetail,
  fetchReviews,
  fetchReservationReviewInfo,
} from "../apis/review.api"
import { useNavigate } from "react-router-dom"

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

export const useReviewsQuery = (page: number) => {
  return useQuery({
    queryKey: ["reviews", page],
    queryFn: () => fetchReviews(page),
  })
}

export const useReviewDetailQuery = (reviewId: string) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => fetchReviewDetail(reviewId),
  })
}

export const useCreateReviewMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (request: CreateReviewRequest) => createReview(request),
    onSuccess: () => {
      navigate("/reviews")
    },
  })
}

export const useReservationReviewInfoQuery = (reservationId: string) => {
  return useQuery({
    queryKey: ["reservationReviewInfo", reservationId],
    queryFn: () => fetchReservationReviewInfo(reservationId),
  })
}
