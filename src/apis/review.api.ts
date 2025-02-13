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
  images?: File[]
}

export const createReview = async (
  request: CreateReviewRequest,
): Promise<void> => {
  const formData = new FormData()
  formData.append("r_idx", request.r_idx)
  formData.append("review", JSON.stringify(request.review))

  if (request.review_memo) {
    formData.append("review_memo", request.review_memo)
  }

  if (request.images) {
    request.images.forEach((image, index) => {
      formData.append(`upload[${index}]`, image)
    })
  }

  await axiosClient.post<HTTPResponse<null>>("/reviews/reviews", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
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
