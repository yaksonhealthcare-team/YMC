export interface PaymentHistory {
  id: string
  index: string
  paidAt: Date
  type: string
  status: string
  pointStatus: "yet" | "done"
  point: number
  category: "additional" | "membership"
  items: PaymentHistoryItem[]
}

export interface PaymentItem {
  id?: string
  s_idx: number
  ss_idx: number
  b_idx: number
  brand_code: string
  amount: number
  b_type: "지정지점" | "전지점"
  title: string
  brand: string
  branchType: string
  duration: number
  price: number
  originalPrice?: number
  sessions: number
  name?: string
}

export interface PaymentHistoryItem {
  index: string
  status: string
  name: string
  branchName: string
  brand: string
  amount: number
  price: number
  reservationId?: string
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
  is_add_service: string
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
  is_add_service: string
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
      r_idx?: string
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

export interface PaymentCompleteState {
  orderId: string
  type: "membership" | "additional"
  items: PaymentResponseItem[]
  paymentMethod: "CARD" | "BANK" | "VBANK"
  cardPaymentInfo?: {
    cardName: string
    installment: string
  }
  vbankInfo?: {
    bankName: string
    bankCode: string
    account: string
    accountName: string
    limitDate: string
  }
  amount_info: {
    total_amount: string
    discount_amount: number
    point_amount: string
    payment_amount: string
  }
  point_info: {
    used_point: string
    remaining_point: string
  }
  message?: string
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export interface PaymentResult {
  orderId: string
  paymentKey?: string
  amount: string
  status: PaymentStatus
  error?: string
}

export interface VirtualAccountInfo {
  amt: string
  bankcode: string
  bankname: string
  account: string
  account_name: string
  limitdate: string
}

export interface PaymentCancelRequest {
  orderid: string
  p_idx: string[]
  cancel_memo?: string
  refundAcctNum?: string // 가상계좌 환불시 필수
  refundBankCode?: string // 가상계좌 환불시 필수
  refundAcctName?: string // 가상계좌 환불시 필수
}

export interface PaymentCardInfo {
  type: "CARD"
  paydate: string
  amt: string
  appno: string
  cardcd: string
  cardname: string
  card_noinf: string
  quota: string
}

export interface PaymentBankInfo {
  type: "BANK"
  paydate: string
  amt: string
  bankcode: string
  bankname: string
}

export interface PaymentVbankInfo {
  type: "VBANK"
  amt: string
  bankcode: string
  bankname: string
  account: string
  account_name: string
  limitdate: string
}

export type PaymentInfo = PaymentCardInfo | PaymentBankInfo | PaymentVbankInfo

export interface PaymentResponseItem {
  p_idx: string
  title: string
  sessions: string
  amount: string
  brand: {
    name: string
    code: string
  }
  branch: {
    name: string
    code: string
  }
}

export interface PaymentAmountInfo {
  total_amount: string
  discount_amount: number
  point_amount: string
  payment_amount: string
}

export interface PaymentPointInfo {
  used_point: string
  remaining_point: string
}

export interface CashReceiptInfo {
  type: string
  identityNum: string
  amount: string
  serviceCharge: string
  taxFreeAmount: string
  totalAmount: string
}

export interface PaymentResponse {
  resultCode: string
  resultMessage: string
  body: {
    orderid: string
    p_idx: string[]
    pay_info: PaymentInfo
    cahereceipt_info: CashReceiptInfo | null
    mp_info: number[] | null
    items: PaymentResponseItem
    amount_info: PaymentAmountInfo
    point_info: PaymentPointInfo
  }
}

export interface PaymentRequestItem {
  p_idx: string
  title: string
  sessions: string
  amount: string
  brand_code: string
  branch_code: string
}

export interface PaymentRequest {
  orderid?: string
  items: PaymentRequestItem[]
  payment_method: "CARD" | "BANK" | "VBANK"
  point_amount?: string
  total_amount: string
  payment_amount: string
  vbank_info?: {
    bank_code: string
    account_name: string
  }
}
