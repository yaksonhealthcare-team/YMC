import { MembershipOption } from "../types/Membership.ts"
import { Branch } from "../types/Branch.ts"
import { create } from "zustand"

export interface SelectedOption {
  option: MembershipOption
  count: number
}

interface MembershipOptionsStore {
  currentPath: string | null
  selectedOptions: SelectedOption[]
  selectedBranch: Branch | null
  isBottomSheetOpen: boolean
  setCurrentPath: (path: string | null) => void
  setSelectedOptions: (options: SelectedOption[]) => void
  setSelectedBranch: (branch: Branch | null) => void
  setIsBottomSheetOpen: (isOpen: boolean) => void
  clear: () => void
}

const initialState = {
  currentPath: null,
  selectedOptions: [],
  selectedBranch: null,
  isBottomSheetOpen: false,
}

export const useMembershipOptionsStore = create<MembershipOptionsStore>((set) => ({
  ...initialState,
  setCurrentPath: (path) => set({ currentPath: path }),
  setSelectedOptions: (options) => set({ selectedOptions: options }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setIsBottomSheetOpen: (isOpen) => set({ isBottomSheetOpen: isOpen }),
  clear: () => set(initialState),
}))
