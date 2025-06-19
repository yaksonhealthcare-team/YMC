import { create } from 'zustand';
import { FilterItem, reservationFilters } from 'types/Reservation';

interface ReservationStore {
  filter: FilterItem;
  setFilter: (filter: FilterItem) => void;
  resetFilter: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  filter: reservationFilters[1], // 기본값은 방문예정으로 설정
  setFilter: (filter: FilterItem) => set({ filter }),
  resetFilter: () => set({ filter: reservationFilters[1] }) // 방문예정 탭으로 리셋
}));
