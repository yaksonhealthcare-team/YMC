/**
 * 좌표 관련 유틸리티 함수들
 */

/**
 * 위도와 경도를 나타내는 인터페이스
 */
interface Coordinate {
  latitude: number
  longitude: number
}

/**
 * 지점의 위도와 경도를 나타내는 인터페이스 (API 응답 형식)
 */
interface BranchLocation {
  b_lat: string | number // 위도
  b_lon: string | number // 경도
}

/**
 * 좌표 값(문자열 또는 숫자)을 숫자로 변환합니다.
 * 유효하지 않은 값의 경우 0을 반환합니다.
 * @param coord - 변환할 좌표 값
 * @returns 변환된 숫자 좌표 값. 유효하지 않으면 0.
 */
export const parseCoordinate = (coord: string | number | undefined): number => {
  if (coord === undefined || coord === null || coord === "") {
    console.warn("Invalid coordinate value received:", coord)
    return 0
  }
  const num = typeof coord === "string" ? Number(coord) : coord
  if (isNaN(num)) {
    console.warn("Coordinate could not be parsed to a number:", coord)
    return 0
  }
  return num
}

/**
 * BranchLocation 객체 (API 응답)를 Coordinate 객체로 변환합니다.
 * @param branch - 변환할 BranchLocation 객체
 * @returns 변환된 Coordinate 객체
 */
export const formatCoordinate = (branch: BranchLocation): Coordinate => ({
  latitude: parseCoordinate(branch.b_lat),
  longitude: parseCoordinate(branch.b_lon),
})

/**
 * 두 지점 간의 거리를 Haversine 공식을 사용하여 킬로미터(km) 단위로 계산합니다.
 * @param coord1 - 첫 번째 지점의 좌표 (Coordinate 객체)
 * @param coord2 - 두 번째 지점의 좌표 (Coordinate 객체)
 * @returns 두 지점 간의 거리 (km)
 */
export const calculateDistance = (
  coord1: Coordinate,
  coord2: Coordinate,
): number => {
  if (
    !coord1 ||
    !coord2 ||
    isNaN(coord1.latitude) ||
    isNaN(coord1.longitude) ||
    isNaN(coord2.latitude) ||
    isNaN(coord2.longitude)
  ) {
    console.warn(
      "Invalid coordinates provided to calculateDistance:",
      coord1,
      coord2,
    )
    return Infinity // 유효하지 않은 좌표는 무한대 거리 반환
  }

  const R = 6371 // 지구의 반지름 (km)
  const dLat = toRad(coord2.latitude - coord1.latitude)
  const dLon = toRad(coord2.longitude - coord1.longitude)
  const lat1 = toRad(coord1.latitude)
  const lat2 = toRad(coord2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

/**
 * 각도(degree)를 라디안(radian)으로 변환합니다.
 * @param degree - 변환할 각도 값
 * @returns 변환된 라디안 값
 */
const toRad = (degree: number): number => {
  return (degree * Math.PI) / 180
}
