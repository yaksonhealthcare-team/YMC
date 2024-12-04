import { Review, ReviewResponse } from "../types/Review.ts"

export class ReviewMapper {
  static toReviewEntity = (dto: ReviewResponse): Review => {
    return {
      id: dto.r_idx,
      date: new Date(dto.r_date),
      brandName: dto.b_name,
      programName: dto.ps_name,
      visit: dto.visit,
      grade: {
        low: dto.rs_grade_L,
        medium: dto.rs_grade_M,
        high: dto.rs_grade_H,
      },
      content: dto.review_memo,
      imageUrls: dto.imgList,
    }
  }

  static toReviewEntities = (dtos: ReviewResponse[]): Review[] => {
    return dtos.map(this.toReviewEntity)
  }
}
