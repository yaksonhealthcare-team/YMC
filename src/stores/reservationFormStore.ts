import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Branch } from '../types/Branch';
import { AdditionalManagement } from '../types/Membership';
import { TimeSlot } from '../types/Schedule';

export interface ReservationFormData {
  date: null | dayjs.Dayjs;
  /**
   * 예약 일시
   */
  timeSlot: null | TimeSlot;
  request: string;
  additionalServices: AdditionalManagement[];
  item?: string;
  /**
   * 상담예약 - 메뉴
   */
  menu?: { value: string; name: string; price: string };

  /**
   * 지점
   */
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
}

const initialState: ReservationFormData = {
  item: undefined,
  menu: { value: '', name: '', price: '' },
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
      clearAll: () =>
        set({
          formData: initialState,
          selectedBranch: null
        })
    }),
    { name: 'reservation-form-store' }
  )
);
