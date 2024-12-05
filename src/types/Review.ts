export interface ReviewResponse {
  r_idx: string
  r_date: string
  b_name: string
  ps_name: string
  visit: string
  rs_grade_L: string
  rs_grade_M: string
  rs_grade_H: string
  review_memo: string
  imgList: string[]
}

export interface Review {
  id: string
  date: Date
  brandName: string
  programName: string
  visit: string
  grade: {
    low: string
    medium: string
    high: string
  }
  content: string
  imageUrls: string[]
}
