export interface PaymentHistory {
  id: string
  index: string
  paidAt: Date
  type: string
  status: string
  pointStatus: "yet" | "done"
  point: number
  category: string // TODO: 회원권 / 추가관리 구분 필드 생기면 변경할 것
  items: PaymentHistoryItem[]
}

export interface PaymentHistoryItem {
  index: string
  status: string
  name: string
  branchName: string
  brand: string
  amount: number
  price: number
}

export interface PaymentHistoryCancel {
  canceledAt: Date
  payMethod: string
  canceledPrice: number
  usedPoint: number
  refundPoint: number
  totalPrice: number
  reason: string
}

export interface PaymentHistoryResponse {
  orderid: string
  p_idx: string
  pay_date: string
  pay_gubun: string
  pay_status: string
  point_status: string
  point: number
  paysub: {
    ps_idx: string
    ps_pay_status: string
    ps_name: string
    ps_total_amount: string
    ps_total_price: string
    brand_name: string
    b_name: string
  }[]
}

export interface PaymentHistoryDetail extends PaymentHistory {
  payMethod: string
  totalPrice: number
  usedPoint: number
  actualPrice: number
  items: (PaymentHistoryItem & { cancel: PaymentHistoryCancel })[]
}

export interface PaymentHistoryDetailResponse {
  orderid: string
  p_idx: string
  pay_date: string
  pay_gubun: string
  pay_status: string
  point_status: string
  point: string
  pay_method: string
  total_price: string
  use_point: string
  actual_price: string
  paysub: [
    {
      p_idx: string
      ps_pay_status: string
      ps_name: string
      ps_total_amount: string
      ps_total_price: string
      brand_name: string
      b_name: string
      payCancel: {
        ps_cancel_pay_date: string
        ps_cancel_pg_paymethod: string
        ps_cancel_price: string
        ps_cancel_use_point: string
        ps_cancel_refund_point: string
        ps_cancel_total_price: string
        ps_cancel_message: string
      }
    },
  ]
}
