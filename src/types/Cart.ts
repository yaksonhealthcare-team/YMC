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

export interface CartItemPostRequest {
  s_idx: number
  ss_idx: number
  b_idx: number
  brand_code: string
  amount: number
}
