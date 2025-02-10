import { create } from "zustand"
import { Branch } from "../types/Branch"
import { PaymentStatus, PaymentItem } from "../types/Payment"

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
