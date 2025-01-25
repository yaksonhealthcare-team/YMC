import {
  Review,
  ReviewResponse,
  ReviewDetail,
  ReviewDetailResponse,
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
  const { data } = await axiosClient.get<HTTPResponse<ReviewDetailResponse>>(
    "/reviews/detail",
    {
      params: {
        r_idx: reviewId,
      },
    },
  )

  return ReviewMapper.toReviewDetailEntity(data.body)
}
