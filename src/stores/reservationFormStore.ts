import { create } from "zustand"
import { devtools } from "zustand/middleware"
import dayjs from "dayjs"
import { TimeSlot } from "../types/Schedule"
import { AdditionalManagement } from "../types/Membership"

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
  setFormData: (data: Partial<ReservationFormData>) => void
  resetFormData: () => void
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
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetFormData: () => set({ formData: initialState }),
    }),
    { name: "reservation-form-store" },
  ),
)
