import { create } from "zustand"
import { Branch } from "../types/Branch"
import { PaymentStatus, PaymentItem } from "../types/Payment"

interface Points {
  availablePoints: number
  usedPoints: number
}

interface PaymentStore {
  items: PaymentItem[]
  selectedBranch: Branch | null
  paymentStatus: PaymentStatus
  points: Points
  setItems: (items: PaymentItem[]) => void
  setBranch: (branch: Branch) => void
  clear: () => void
  setPaymentStatus: (status: PaymentStatus) => void
  setPoints: (points: number) => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  items: [],
  selectedBranch: null,
  paymentStatus: PaymentStatus.PENDING,
  points: {
    availablePoints: 0,
    usedPoints: 0,
  },
  setItems: (items) => set({ items }),
  setBranch: (branch) => set({ selectedBranch: branch }),
  clear: () => set({ items: [], selectedBranch: null }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setPoints: (points) =>
    set((state) => ({
      points: {
        ...state.points,
        usedPoints: points,
      },
    })),
}))
