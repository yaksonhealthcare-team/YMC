import { create } from "zustand"
import { Branch } from "../types/Branch"
import { PaymentStatus } from "../types/Payment"

interface PaymentItem {
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
  quantity?: number
}

interface PaymentStore {
  items: PaymentItem[]
  selectedBranch: Branch | null
  paymentStatus: PaymentStatus
  setItems: (items: PaymentItem[]) => void
  setBranch: (branch: Branch) => void
  clear: () => void
  setPaymentStatus: (status: PaymentStatus) => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  items: [],
  selectedBranch: null,
  paymentStatus: PaymentStatus.PENDING,
  setItems: (items) => set({ items }),
  setBranch: (branch) => set({ selectedBranch: branch }),
  clear: () => set({ items: [], selectedBranch: null }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
}))
