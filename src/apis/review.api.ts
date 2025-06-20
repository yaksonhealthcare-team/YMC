import { ReviewMapper } from '@/mappers/ReviewMapper';
import { axiosClient } from '@/queries/clients';
import { HTTPResponse } from '@/types/HTTPResponse';
import { Review, ReviewDetail, ReviewResponse, ReviewSection } from '@/types/Review';

export const fetchReviews = async (page: number): Promise<Review[]> => {
  console.log('[fetchReviews] 리뷰 목록 조회 시작 - 페이지:', page);
  try {
    const { data } = await axiosClient.get<HTTPResponse<ReviewResponse[]>>('/reviews/history/history', {
      params: {
        page: page,
        size: 10
      }
    });
    console.log('[fetchReviews] 리뷰 목록 조회 응답:', data);

    if (!data.body || !Array.isArray(data.body)) {
      console.error('[fetchReviews] 리뷰 데이터가 유효하지 않음:', data);
      return [];
    }

    const reviews = ReviewMapper.toReviewEntities(data.body);
    console.log('[fetchReviews] 변환된 리뷰 목록:', reviews);
    return reviews;
  } catch (error) {
    console.error('[fetchReviews] 리뷰 목록 조회 오류:', error);
    throw error;
  }
};

export const fetchReviewDetail = async (reviewId: string): Promise<ReviewDetail> => {
  console.log('[fetchReviewDetail] 리뷰 상세 조회 시작 - ID:', reviewId);
  try {
    const { data } = await axiosClient.get<HTTPResponse<ReviewResponse[]>>('/reviews/history/detail', {
      params: {
        r_idx: reviewId
      }
    });

    console.log('[fetchReviewDetail] 리뷰 상세 조회 응답:', data);

    if (!data.body || !data.body.length) {
      console.error('[fetchReviewDetail] 리뷰 데이터가 없음:', data);
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    const reviewDetail = ReviewMapper.toReviewDetailEntity(data.body[0]);
    console.log('[fetchReviewDetail] 변환된 리뷰 상세:', reviewDetail);
    return reviewDetail;
  } catch (error) {
    console.error('[fetchReviewDetail] 리뷰 상세 조회 오류:', error);
    throw error;
  }
};

export interface CreateReviewRequest {
  r_idx: string;
  review: Array<{
    rs_idx: string;
    rs_grade: 'L' | 'M' | 'H';
  }>;
  review_memo?: string;
  images?: string[];
}

export const createReview = (request: CreateReviewRequest) => {
  return axiosClient.post<HTTPResponse<CreateReviewRequest>>('/reviews/reviews', request, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export interface ReservationReviewInfo {
  r_idx: string;
  r_date: string;
  b_name: string;
  ps_name: string;
  review_items: Array<{
    rs_idx: string;
    rs_type: string;
  }>;
}

export const fetchReservationReviewInfo = async (reservationId: string): Promise<ReservationReviewInfo> => {
  const { data } = await axiosClient.get<HTTPResponse<ReservationReviewInfo>>(`/reviews/reviews/info/${reservationId}`);

  return data.body;
};

export const fetchReviewSections = async (): Promise<ReviewSection[]> => {
  const { data } = await axiosClient.get<HTTPResponse<ReviewSection[]>>('/reviews/sections');
  return data.body;
};

export interface ReviewQuestion {
  rs_idx: string;
  sc_name: string;
}

export const fetchReviewQuestions = async (reviewId: string): Promise<ReviewQuestion[]> => {
  const { data } = await axiosClient.get<HTTPResponse<ReviewQuestion[]>>('/reviews/reviews', {
    params: {
      r_idx: reviewId
    }
  });

  return data.body;
};
