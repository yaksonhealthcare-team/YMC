import { create } from "zustand"
import { MyMembershipFilterItem, myMembershipFilters } from "types/Membership"

interface MembershipStore {
  filter: MyMembershipFilterItem
  setFilter: (filter: MyMembershipFilterItem) => void
}

export const useMembershipStore = create<MembershipStore>((set) => ({
  filter: myMembershipFilters[0], // 기본값은 전체로 설정
  setFilter: (filter: MyMembershipFilterItem) => set({ filter }),
}))
