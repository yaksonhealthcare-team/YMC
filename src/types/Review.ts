export interface ReviewResponse {
  r_idx: string
  r_date: string
  b_name: string
  ps_name: string
  visit: number
  total_count: number
  rs_grade_L: string
  rs_grade_M: string
  rs_grade_H: string
  evaluations: {
    question: string
    rs_grade: "L" | "M" | "H"
  }[]
  review_memo: string
  imgList: string[]
}

export interface ReviewDetailResponse extends ReviewResponse {
  additional_services: string[]
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
