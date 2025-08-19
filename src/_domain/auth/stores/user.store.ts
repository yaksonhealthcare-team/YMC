import { create } from 'zustand';
import { UserSchema } from '../types';

export interface UserStore {
  user: UserSchema | null;
  setUser: (user: UserSchema | null) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null })
}));
