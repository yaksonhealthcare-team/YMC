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

export interface FileUploadResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  files: {
    result: string
    filename: string
    fileurl: string
  }[]
}

export interface FileUploadRequest {
  fileToUpload: File[]
  nextUrl: string
}

// 이미지 업로드 API
export const uploadImages = async (
  request: FileUploadRequest,
): Promise<string[]> => {
  const formData = new FormData()

  request.fileToUpload.forEach((file) => {
    formData.append(`fileToUpload[]`, file)
  })
  formData.append(
    "nextUrl",
    `${import.meta.env.VITE_API_BASE_URL}${request.nextUrl}`,
  )

  const { data } = await axiosClient.post<FileUploadResponse>(
    "/images/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  // fileurl 배열로 변환
  return data.files.map((item) => item.fileurl)
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
