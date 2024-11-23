type PaymentHistoryDTO = {
  orderid: string
  p_idx: string
  pay_date: string
  pay_gubun: string
  pay_type: string
  pay_status: string
  pay_current_status: string
  point_status: string
  point: number
  paysub: [
    {
      ps_idx: string
      ps_pay_status: string
      ps_pay_current_status: string
      ps_name: string
      ps_total_amount: string
      ps_total_price: string
      b_name: string
    },
  ]
}

export type { PaymentHistoryDTO }
