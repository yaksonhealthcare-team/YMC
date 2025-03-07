import {
  Review,
  ReviewResponse,
  ReviewDetail,
  ReviewSection,
} from "../types/Review.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { ReviewMapper } from "../mappers/ReviewMapper.ts"

export const fetchReviews = async (page: number): Promise<Review[]> => {
  const { data } = await axiosClient.get<HTTPResponse<ReviewResponse[]>>(
    "/reviews/history/history",
    {
      params: {
        page: page,
        size: 10,
      },
    },
  )

  return ReviewMapper.toReviewEntities(data.body)
}

export const fetchReviewDetail = async (
  reviewId: string,
): Promise<ReviewDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<ReviewResponse[]>>(
    "/reviews/history/detail",
    {
      params: {
        r_idx: reviewId,
      },
    },
  )

  if (!data.body.length) {
    throw new Error("리뷰를 찾을 수 없습니다.")
  }

  return ReviewMapper.toReviewDetailEntity(data.body[0])
}

export interface CreateReviewRequest {
  r_idx: string
  review: Array<{
    rs_idx: string
    rs_grade: "L" | "M" | "H"
  }>
  review_memo?: string
  images?: string[]
}

export const createReview = (request: CreateReviewRequest) => {
  return axiosClient.post<HTTPResponse<CreateReviewRequest>>(
    "/reviews/reviews",
    request,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export interface ReservationReviewInfo {
  r_idx: string
  r_date: string
  b_name: string
  ps_name: string
  review_items: Array<{
    rs_idx: string
    rs_type: string
  }>
}

export const fetchReservationReviewInfo = async (
  reservationId: string,
): Promise<ReservationReviewInfo> => {
  const { data } = await axiosClient.get<HTTPResponse<ReservationReviewInfo>>(
    `/reviews/reviews/info/${reservationId}`,
  )

  return data.body
}

export const fetchReviewSections = async (): Promise<ReviewSection[]> => {
  const { data } =
    await axiosClient.get<HTTPResponse<ReviewSection[]>>("/reviews/sections")
  return data.body
}

export interface ReviewQuestion {
  rs_idx: string
  sc_name: string
}

export const fetchReviewQuestions = async (
  reviewId: string,
): Promise<ReviewQuestion[]> => {
  const { data } = await axiosClient.get<HTTPResponse<ReviewQuestion[]>>(
    "/reviews/reviews",
    {
      params: {
        r_idx: reviewId,
      },
    },
  )

  return data.body
}
