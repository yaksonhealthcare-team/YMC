import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  refreshToken: string | null
  setRefreshToken: (token: string | null) => void
  clearRefreshToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      refreshToken: null,
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearRefreshToken: () => set({ refreshToken: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
