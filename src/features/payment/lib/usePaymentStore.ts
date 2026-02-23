import { Branch } from '@/entities/branch/model/Branch';
import { PaymentItem, PaymentStatus } from '@/entities/payment/model/Payment';
import { create } from 'zustand';

interface Points {
  availablePoints: number;
  usedPoints: number;
}

interface PaymentStore {
  items: PaymentItem[];
  selectedBranch: Branch | null;
  paymentStatus: PaymentStatus;
  points: Points;
  selectedPaymentMethod: 'card' | 'bank' | 'vbank';
  setItems: (items: PaymentItem[]) => void;
  setBranch: (branch: Branch) => void;
  clear: () => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPoints: (points: number) => void;
  setPaymentMethod: (method: 'card' | 'bank' | 'vbank') => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  items: [],
  selectedBranch: null,
  paymentStatus: PaymentStatus.PENDING,
  points: {
    availablePoints: 0,
    usedPoints: 0
  },
  selectedPaymentMethod: 'card',
  setItems: (items) => set({ items }),
  setBranch: (branch) => set({ selectedBranch: branch }),
  clear: () => set({ items: [], selectedBranch: null }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setPoints: (points) =>
    set((state) => ({
      points: {
        ...state.points,
        usedPoints: points
      }
    })),
  setPaymentMethod: (method) => set({ selectedPaymentMethod: method })
}));
