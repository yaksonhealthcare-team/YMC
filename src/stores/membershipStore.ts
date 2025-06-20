import { MyMembershipFilterItem, myMembershipFilters } from '@/types/Membership';
import { create } from 'zustand';

interface MembershipStore {
  filter: MyMembershipFilterItem;
  setFilter: (filter: MyMembershipFilterItem) => void;
  resetFilter: () => void;
}

export const useMembershipStore = create<MembershipStore>((set) => ({
  filter: myMembershipFilters[0], // 기본값은 전체로 설정
  setFilter: (filter: MyMembershipFilterItem) => set({ filter }),
  resetFilter: () => set({ filter: myMembershipFilters[0] }) // 기본 필터로 리셋
}));
