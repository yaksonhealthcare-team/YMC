import { Coordinate } from '@/shared/types/Coordinate';
import { create } from 'zustand';

interface BranchLocationSelect {
  location: { address: string; coords: Coordinate } | null;
  setLocation: (location: { address: string; coords: Coordinate }) => void;
  clear: () => void;
}

export const useBranchLocationSelect = create<BranchLocationSelect>((set) => ({
  location: null,
  setLocation: ({ address, coords }) =>
    set({
      location: { address, coords }
    }),
  clear: () => set({ location: null })
}));
