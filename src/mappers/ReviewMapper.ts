import {
  Review,
  ReviewResponse,
  ReviewDetail,
  ReviewDetailResponse,
} from "../types/Review.ts"

export class ReviewMapper {
  static toReviewEntity(review: ReviewResponse): Review {
    return {
      id: review.r_idx,
      date: review.r_date,
      brandName: review.b_name,
      programName: review.ps_name,
      visit: review.visit,
      totalCount: review.total_count,
      grade: {
        L: review.rs_grade_L || "0",
        M: review.rs_grade_M || "0",
        H: review.rs_grade_H || "0",
      },
      evaluations:
        review.evaluations?.map((evaluation) => ({
          question: evaluation.question,
          grade: evaluation.rs_grade,
        })) || [],
      content: review.review_memo || "",
      imageUrls: review.imgList || [],
    }
  }

  static toReviewEntities(reviews: ReviewResponse[]): Review[] {
    return reviews.map((review) => this.toReviewEntity(review))
  }

  static toReviewDetailEntity(review: ReviewDetailResponse): ReviewDetail {
    return {
      ...this.toReviewEntity(review),
      additionalServices: review.additional_services || [],
    }
  }
}
