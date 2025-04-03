import { useEffect } from "react"
import { useGeolocationStore } from "../stores/geolocationStore"
import { GeolocationOptions } from "../types/Coordinate"
import { DEFAULT_COORDINATE } from "../constants/coordinate"

const isReactNative = () => window.ReactNativeWebView

interface MessageEvent {
  type: "GET_LOCATION"
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const { location, error, loading, setLocation, setError, setLoading } =
    useGeolocationStore()

  useEffect(() => {
    if (isReactNative()) {
      const handleLocationReceived = (event: CustomEvent) => {
        const { latitude, longitude } = event.detail
        setLocation(latitude, longitude)
        setLoading(false)
      }

      const handleLocationError = (event: CustomEvent) => {
        setError(event.detail.message)
        setLocation(DEFAULT_COORDINATE.latitude, DEFAULT_COORDINATE.longitude)
        setLoading(false)
      }

      window.addEventListener(
        "locationReceived",
        handleLocationReceived as EventListener,
      )
      window.addEventListener(
        "locationError",
        handleLocationError as EventListener,
      )

      const message: MessageEvent = { type: "GET_LOCATION" }
      window.ReactNativeWebView?.postMessage(JSON.stringify(message))

      return () => {
        window.removeEventListener(
          "locationReceived",
          handleLocationReceived as EventListener,
        )
        window.removeEventListener(
          "locationError",
          handleLocationError as EventListener,
        )
      }
    }

    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않는 브라우저입니다.")
      setLocation(DEFAULT_COORDINATE.latitude, DEFAULT_COORDINATE.longitude)
      setLoading(false)
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation(position.coords.latitude, position.coords.longitude)
      setLoading(false)
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

      setError(errorMessage)
      setLocation(DEFAULT_COORDINATE.latitude, DEFAULT_COORDINATE.longitude)
      setLoading(false)
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
  }, [])

  return { location, error, loading, setLocation }
}
