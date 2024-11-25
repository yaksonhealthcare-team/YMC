type PaymentHistory = {
  id: string
  index: string
  paid_at: Date
  type: string
  status: string
  pointStatus: "ready" | "done"
  point: number
  items: PaymentHistoryItem[]
}

type PaymentHistoryItem = {
  index: string
  status: string
  name: string
  branchName: string
  brand: string
  amount: number
  price: number
}

export type { PaymentHistory, PaymentHistoryItem }
