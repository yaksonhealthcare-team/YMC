import { create } from "zustand"
import { GeolocationState, DEFAULT_COORDINATE } from "../types/Coordinate"

interface GeolocationStore extends GeolocationState {
  setLocation: (latitude: number, longitude: number) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useGeolocationStore = create<GeolocationStore>((set) => ({
  location: DEFAULT_COORDINATE,
  error: null,
  loading: true,
  setLocation: (latitude: number, longitude: number) =>
    set({ location: { latitude, longitude } }),
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading }),
}))
