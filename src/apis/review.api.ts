import { authApi } from '@/_shared';
import { ReviewMapper } from '@/mappers/ReviewMapper';
import { HTTPResponse } from '@/types/HTTPResponse';
import { Review, ReviewDetail, ReviewResponse, ReviewSection } from '@/types/Review';

export const fetchReviews = async (page: number): Promise<Review[]> => {
  try {
    const { data } = await authApi.get<HTTPResponse<ReviewResponse[]>>('/reviews/history/history', {
      params: {
        page: page,
        size: 10
      }
    });

    if (!data.body || !Array.isArray(data.body)) {
      return [];
    }

    const reviews = ReviewMapper.toReviewEntities(data.body);
    return reviews;
  } catch (error) {
    console.error('[fetchReviews] 리뷰 목록 조회 오류:', error);
    throw error;
  }
};

export const fetchReviewDetail = async (reviewId: string): Promise<ReviewDetail> => {
  try {
    const { data } = await authApi.get<HTTPResponse<ReviewResponse[]>>('/reviews/history/detail', {
      params: {
        r_idx: reviewId
      }
    });

    if (!data.body || !data.body.length) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    const reviewDetail = ReviewMapper.toReviewDetailEntity(data.body[0]);
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
  return authApi.post<HTTPResponse<CreateReviewRequest>>('/reviews/reviews', request, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const fetchReviewSections = async (): Promise<ReviewSection[]> => {
  const { data } = await authApi.get<HTTPResponse<ReviewSection[]>>('/reviews/sections');
  return data.body;
};

export interface ReviewQuestion {
  rs_idx: string;
  sc_name: string;
}

export const fetchReviewQuestions = async (reviewId: string): Promise<ReviewQuestion[]> => {
  const { data } = await authApi.get<HTTPResponse<ReviewQuestion[]>>('/reviews/reviews', {
    params: {
      r_idx: reviewId
    }
  });

  return data.body;
};
