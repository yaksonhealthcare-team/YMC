import { Coordinate } from "../types/Coordinate.ts"

/**
 * 사용자의 현재 위치 정보(위도, 경도)를 비동기적으로 가져옵니다.
 * 브라우저의 Geolocation API를 사용합니다.
 * @param options - Geolocation API의 getCurrentPosition 옵션 (선택 사항).
 * @param onSuccess - 위치 정보를 성공적으로 가져왔을 때 호출되는 콜백 함수.
 * @param onError - 위치 정보를 가져오는 데 실패했을 때 호출되는 콜백 함수.
 */
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
    // onError 콜백은 GeolocationPositionError 타입의 에러 객체를 받습니다.
    (error: GeolocationPositionError) => {
      onError?.(error) // 타입 에러를 방지하기 위해 명시적으로 콜백 호출
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
      ...options,
    },
  )
}
