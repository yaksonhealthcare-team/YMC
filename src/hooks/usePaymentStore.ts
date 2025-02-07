import { create } from "zustand"
import { Branch } from "../types/Branch"

interface PaymentItem {
  s_idx: number
  ss_idx: number
  b_idx: number
  brand_code: string
  amount: number
  b_type: "지정지점"
  title: string
  brand: string
  branchType: string
  duration: number
  price: number
  originalPrice?: number
  sessions: number
}

interface PaymentStore {
  items: PaymentItem[]
  selectedBranch: Branch | null
  setItems: (items: PaymentItem[]) => void
  setBranch: (branch: Branch) => void
  clear: () => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  items: [],
  selectedBranch: null,
  setItems: (items) => set({ items }),
  setBranch: (branch) => set({ selectedBranch: branch }),
  clear: () => set({ items: [], selectedBranch: null }),
}))
