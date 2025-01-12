import { useEffect, useState } from "react"
import {
  DEFAULT_COORDINATE,
  GeolocationOptions,
  GeolocationState,
} from "../types/Coordinate.ts"

const useGeolocation = (options: GeolocationOptions = {}): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: DEFAULT_COORDINATE,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation이 지원되지 않는 브라우저입니다.",
        loading: false,
      }))
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setState((prev) => ({
        ...prev,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
      }))
    }

    const errorHandler = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      defaultOptions,
    )
  }, [])

  return state
}

export default useGeolocation
