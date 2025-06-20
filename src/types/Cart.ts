export interface CartWithSummary {
  items: CartItem[];
  summary: CartSummary;
}

export interface CartItem {
  id: string;
  brand: string;
  branchType: string;
  title: string;
  duration: number;
  options: CartItemOption[];
  branchId: string;
  brandCode: string;
  branchName?: string;
}

export interface CartItemOption {
  items: {
    cartId: string;
    count: number;
  }[];
  sessions: number;
  price: number;
  originalPrice: number;
  ss_idx: string;
}

/**
 * ss: subscription
 * s: membership (s_idx -> /membership/:s_idx in the url)
 *
 * CartItem: 장바구니에 담긴 항목의 아이템입니다.
 */
export interface CartItemResponse {
  csc_idx: string;
  membership: {
    s_idx: string;
    s_name: string;
    s_time: string;
    original_price: string | null;
    ss_price: string;
  };
  branch: {
    s_type: string; // "지점 회원권" | "앱전용 회원권"
    brand_name: string;
    brand_code: string;
    b_idx: string;
    b_name: string;
  };
  option: {
    ss_idx: string;
    ss_count: string;
    ss_unit_price: string;
    original_price: string | null;
  };
  origin_price: number;
  price: number;
  amount: string;
}

export interface CartSummary {
  total_origin_price: number;
  total_price: number;
  total_count: number;
}

export interface CartItemPostRequest {
  s_idx: number;
  ss_idx: number;
  b_idx?: number;
  brand_code: string;
  amount: number;
  b_type: '전지점' | '지정지점'; // 지점 타입
}
