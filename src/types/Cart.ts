/**
 * ss: subscription
 * s: membership (s_idx -> /membership/:s_idx in the url)
 *
 * CartItem: 장바구니에 담긴 항목의 아이템입니다.
 */
export interface CartItem {
  csc_idx: string
  membership: {
    s_idx: string
    s_name: string
    s_time: string
    original_price: string
    ss_price: string
  }
  branch: {
    b_idx: string
    b_name: string
  }
  option: {
    ss_idx: string
    ss_count: string
    ss_unit_price: string
    original_price: string
  }
  original_price: number
  price: number
  amount: string
}

export interface CartSummary {
  total_origin_price: number
  total_price: number
  total_count: number
}

/**
 * 장바구니에 아이템을 추가하는 API body 타입입니다.
 * TODO: 앱전용 회원권일 경우 b_idx가 존재하지 않아서, 백엔드 측에 문의해놓은 상태입니다.
 */
export interface CartItemPostRequest {
  s_idx: number
  ss_idx: number
  b_idx: number
  brand_code: string
  amount: number
}
