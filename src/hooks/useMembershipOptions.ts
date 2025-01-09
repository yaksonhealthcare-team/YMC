import { MembershipOption } from "../types/Membership.ts"
import { Branch } from "../types/Branch.ts"
import { create } from "zustand"

export interface SelectedOption {
  option: MembershipOption
  count: number
}

interface MembershipOptionsStore {
  selectedOptions: SelectedOption[]
  setSelectedOptions: (options: SelectedOption[]) => void
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch) => void
  shouldOpenBottomSheet: boolean
  setShouldOpenBottomSheet: (open: boolean) => void
  clear: () => void
}

export const useMembershipOptionsStore = create<MembershipOptionsStore>(
  (set) => ({
    selectedOptions: [],
    setSelectedOptions: (options) => set({ selectedOptions: options }),
    selectedBranch: null,
    setSelectedBranch: (branch) => set({ selectedBranch: branch }),
    shouldOpenBottomSheet: false,
    setShouldOpenBottomSheet: (open) => set({ shouldOpenBottomSheet: open }),
    clear: () =>
      set({
        selectedOptions: [],
        selectedBranch: null,
        shouldOpenBottomSheet: false,
      }),
  }),
)
