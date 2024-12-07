export interface PaymentHistory {
  id: string
  index: string
  paidAt: Date
  type: string
  status: string
  pointStatus: "yet" | "done"
  point: number
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
