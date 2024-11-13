import { useEffect, useState } from "react"
import { GeolocationOptions, GeolocationState } from "../types/Coordinate.ts"

const useGeolocation = (options: GeolocationOptions = {}): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: {
      latitude: null,
      longitude: null,
    },
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation이 지원되지 않는 브라우저입니다.",
        loading: false,
      }))
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setState(prev => ({
        ...prev,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
      }))
    }

    const errorHandler = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      defaultOptions,
    )
  }, [options])

  return state
}

export default useGeolocation
