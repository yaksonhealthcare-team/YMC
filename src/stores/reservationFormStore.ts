import { ReservationService } from '@/_domain/reservation';
import { ReservationMembershipType } from '@/_domain/reservation/types/reservation.types';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Branch } from '../types/Branch';
import { TimeSlot } from '../types/Schedule';

interface ReservationFormService extends ReservationService {
  name: string;
  price?: string;
  membershipType?: ReservationMembershipType;
}
export interface ReservationFormData {
  /**
   * - consult: 상담 예약
   * - membership: 회원권
   */
  type: 'consult' | 'membership' | null;

  /**
   * 예약 일시
   */
  date: dayjs.Dayjs | null;
  timeSlot: TimeSlot;
  request: string;
  item?: string;

  /**
   * 지점
   */
  branch: string;
  membershipId?: string;

  /**
   * 예약 상품
   */
  services: ReservationFormService[];
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
  type: null,
  item: undefined,
  branch: '',
  date: null,
  timeSlot: { code: '', time: '' },
  request: '',
  membershipId: undefined,
  services: []
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
