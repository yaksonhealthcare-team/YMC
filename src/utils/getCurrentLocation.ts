import { Coordinate } from "../types/Coordinate.ts"

export const getCurrentLocation = ({
  options,
  onSuccess,
  onError,
}: {
  options?: Partial<PositionOptions>
  onSuccess?: (coordinate: Coordinate) => void
  onError?: (error: unknown) => void
}) => {
  if (!navigator.geolocation) {
    onError?.(new Error("Geolocation is not supported by your browser"))
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess?.({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    onError,
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
      ...options,
    },
  )
}
