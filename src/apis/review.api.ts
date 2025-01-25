import { Review, ReviewResponse, ReviewDetail } from "../types/Review.ts"
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
