import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query"
import {
  CreateReviewRequest,
  createReview,
  fetchReviewDetail,
  fetchReviews,
  fetchReservationReviewInfo,
  fetchReviewSections,
  fetchReviewQuestions,
} from "../apis/review.api"
import { useNavigate } from "react-router-dom"
import { reviews } from "./keys/reviews.keys"

export const useReviews = () => {
  return useInfiniteQuery({
    queryKey: ["reviews"],
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      const totalPages = lastPage[0].total_page_count
      const nextPage = allPages.length + 1
      return nextPage <= totalPages ? nextPage : undefined
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
      navigate("/review", {
        replace: true,
        state: { returnPath: "/mypage" },
      })
    },
  })
}

export const useReservationReviewInfoQuery = (reservationId: string) => {
  return useQuery({
    queryKey: ["reservationReviewInfo", reservationId],
    queryFn: () => fetchReservationReviewInfo(reservationId),
  })
}

export const useReviewSections = () => {
  return useQuery({
    queryKey: reviews.sections,
    queryFn: fetchReviewSections,
  })
}

export const useReviewQuestions = (reviewId: string) => {
  return useQuery({
    queryKey: ["reviewQuestions", reviewId],
    queryFn: () => fetchReviewQuestions(reviewId),
    enabled: !!reviewId,
    retry: false,
  })
}
