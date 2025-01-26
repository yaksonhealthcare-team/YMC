import { Review, ReviewResponse, ReviewDetail } from "../types/Review.ts"

export class ReviewMapper {
  static toReviewEntity(review: ReviewResponse): Review {
    return {
      id: review.r_idx,
      date: review.r_date,
      brandName: review.b_name,
      programName: review.ps_name,
      visit: parseInt(review.visit),
      totalCount: review.ss_count,
      grade: {
        L: review.rs_grade_L || "0",
        M: review.rs_grade_M || "0",
        H: review.rs_grade_H || "0",
      },
      evaluations: [
        {
          question: "상체관리는 어떠셨나요?",
          grade: "H",
        },
        {
          question: "하체관리는 어떠셨나요?",
          grade: "H",
        },
        {
          question: "얼굴관리는 어떠셨나요?",
          grade: "M",
        },
        {
          question: "마무리 관리는 어떠셨나요?",
          grade: "H",
        },
      ],
      content: review.review_memo || "",
      imageUrls: review.imgList || [],
    }
  }

  static toReviewEntities(reviews: ReviewResponse[]): Review[] {
    return reviews.map((review) => this.toReviewEntity(review))
  }

  static toReviewDetailEntity(review: ReviewResponse): ReviewDetail {
    const additionalServices = review.sc_name ? review.sc_name.split(",") : []

    return {
      ...this.toReviewEntity(review),
      additionalServices,
    }
  }
}
