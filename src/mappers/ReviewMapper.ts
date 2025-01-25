import { Review, ReviewResponse, ReviewDetail } from "../types/Review.ts"
import dayjs from "dayjs"

export class ReviewMapper {
  static toReviewEntity(review: ReviewResponse): Review {
    // 날짜 포맷 변환 (2024-07-31 20:20 -> 2024년 7월 31일)
    const formattedDate = dayjs(review.r_date).format("YYYY년 M월 D일")

    return {
      id: review.r_idx,
      date: formattedDate,
      brandName: review.b_name,
      programName: review.ps_name,
      visit: parseInt(review.visit),
      totalCount: 20, // 프로그램의 총 횟수는 고정값으로 설정
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
