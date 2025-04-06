import { create } from "zustand"
import { devtools } from "zustand/middleware"
import dayjs from "dayjs"
import { TimeSlot } from "../types/Schedule"
import { AdditionalManagement } from "../types/Membership"
import { Branch } from "../types/Branch"

export interface ReservationFormData {
  item: undefined | string
  branch: undefined | string
  date: null | dayjs.Dayjs
  timeSlot: null | TimeSlot
  request: string
  additionalServices: AdditionalManagement[]
  membershipId?: string
}

interface ReservationFormState {
  formData: ReservationFormData
  selectedBranch: Branch | null
  setFormData: (data: Partial<ReservationFormData>) => void
  resetFormData: () => void
  setSelectedBranch: (branch: Branch) => void
  clearAll: () => void
}

const initialState: ReservationFormData = {
  item: undefined,
  branch: undefined,
  date: null,
  timeSlot: null,
  request: "",
  additionalServices: [],
  membershipId: undefined,
}

export const useReservationFormStore = create<ReservationFormState>()(
  devtools(
    (set) => ({
      formData: initialState,
      selectedBranch: null,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetFormData: () => set({ formData: initialState }),
      setSelectedBranch: (branch) =>
        set((state) => ({
          selectedBranch: branch,
          formData: { ...state.formData, branch: branch.b_idx },
        })),
      clearAll: () => set({ formData: initialState, selectedBranch: null }),
    }),
    { name: "reservation-form-store" },
  ),
)
