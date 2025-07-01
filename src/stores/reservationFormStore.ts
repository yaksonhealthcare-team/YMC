import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Branch } from '../types/Branch';
import { AdditionalManagement } from '../types/Membership';
import { TimeSlot } from '../types/Schedule';

export interface ReservationFormData {
  date: null | dayjs.Dayjs;
  timeSlot: null | TimeSlot;
  request: string;
  additionalServices: AdditionalManagement[];
  item?: string;
  consult?: { value: string; name: string };
  branch?: string;
  membershipId?: string;
}

interface ReservationFormState {
  formData: ReservationFormData;
  selectedBranch: Branch | null;
  setFormData: (data: Partial<ReservationFormData>) => void;
  resetFormData: () => void;
  setSelectedBranch: (branch: Branch) => void;
  setInitialMembershipId: (id?: string) => void;
  clearAll: () => void;
  initialMembershipId?: string;
}

const initialState: ReservationFormData = {
  item: undefined,
  consult: { value: '', name: '' },
  branch: undefined,
  date: null,
  timeSlot: null,
  request: '',
  additionalServices: [],
  membershipId: undefined
};

export const useReservationFormStore = create<ReservationFormState>()(
  devtools(
    (set) => ({
      formData: initialState,
      selectedBranch: null,
      initialMembershipId: undefined,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      resetFormData: () => set({ formData: initialState }),
      setSelectedBranch: (branch) =>
        set((state) => ({
          selectedBranch: branch,
          formData: { ...state.formData, branch: branch.b_idx }
        })),
      setInitialMembershipId: (id) => set({ initialMembershipId: id }),
      clearAll: () =>
        set({
          formData: initialState,
          selectedBranch: null,
          initialMembershipId: undefined
        })
    }),
    { name: 'reservation-form-store' }
  )
);
