export interface ReviewResponse {
  r_idx: string
  r_date: string
  b_name: string
  ps_name: string
  visit: string
  sc_name: string
  rs_grade_L: string
  rs_grade_M: string
  rs_grade_H: string
  review_memo: string
  imgList: string[]
}

export interface Review {
  id: string
  date: string
  brandName: string
  programName: string
  visit: number
  totalCount: number
  grade: {
    L: string
    M: string
    H: string
  }
  evaluations: {
    question: string
    grade: "L" | "M" | "H"
  }[]
  content: string
  imageUrls: string[]
}

export interface ReviewDetail extends Review {
  additionalServices: string[]
}
