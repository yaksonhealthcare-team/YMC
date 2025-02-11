import { useEffect, useState } from "react"
import {
  DEFAULT_COORDINATE,
  GeolocationOptions,
  GeolocationState,
} from "../types/Coordinate.ts"

export const useGeolocation = (
  options: GeolocationOptions = {},
): GeolocationState => {
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
      let errorMessage = "위치 정보를 불러올 수 없습니다."

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "위치 정보 접근이 거부되었습니다. 설정에서 위치 정보 접근을 허용해주세요."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "위치 정보를 사용할 수 없습니다. 잠시 후 다시 시도해주세요."
          break
        case error.TIMEOUT:
          errorMessage =
            "위치 정보 요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          break
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
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
