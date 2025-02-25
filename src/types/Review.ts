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
  review: Array<{
    question: string
    response: string
  }>
  review_memo: string
  imgList: string[]
  ss_count: string
  total_count: number
  total_page_count: number
  current_page: number
}

export interface Review {
  id: string
  date: string
  brandName: string
  programName: string
  visit: number
  totalCount: string
  grade: {
    L: string
    M: string
    H: string
  }
  evaluations: {
    question: string
    response: string
  }[]
  content: string
  imageUrls: string[]
  total_count: number
  total_page_count: number
  current_page: number
}

export interface ReviewDetail extends Review {
  additionalServices: string[]
}

export interface ReviewSection {
  rs_idx: string
  sc_name: string
}
