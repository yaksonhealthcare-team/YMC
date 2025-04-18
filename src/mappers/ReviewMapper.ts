import { Review, ReviewResponse, ReviewDetail } from "../types/Review.ts"

export class ReviewMapper {
  static toReviewEntity(review: ReviewResponse): Review {
    return {
      id: review.r_idx,
      date: review.reg_date,
      serviceDate: review.r_date,
      brandName: review.b_name,
      programName: review.ps_name,
      visit: parseInt(review.visit),
      totalCount: review.ss_count,
      grade: {
        L: review.rs_grade_L || "0",
        M: review.rs_grade_M || "0",
        H: review.rs_grade_H || "0",
      },
      evaluations: review.review || [],
      content: review.review_memo || "",
      imageUrls: (review.imgList || []).map((img) => img.r_pic),
      total_count: review.total_count,
      total_page_count: review.total_page_count,
      current_page: review.current_page,
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
      images: (review.imgList || []).map((img) => img.r_pic),
    }
  }
}
