/**
 * 좌표 관련 유틸리티 함수들
 */

interface Coordinate {
  latitude: number
  longitude: number
}

interface BranchLocation {
  b_lat: string | number
  b_lon: string | number
}

/**
 * 좌표 문자열을 숫자로 변환
 */
export const parseCoordinate = (coord: string | number | undefined): number => {
  if (!coord) return 0
  return typeof coord === "string" ? Number(coord) : coord
}

/**
 * 지점 좌표 정보를 Coordinate 객체로 변환
 */
export const formatCoordinate = (branch: BranchLocation): Coordinate => ({
  latitude: parseCoordinate(branch.b_lat),
  longitude: parseCoordinate(branch.b_lon),
})

/**
 * 두 좌표 간의 거리 계산 (km)
 */
export const calculateDistance = (
  coord1: Coordinate,
  coord2: Coordinate,
): number => {
  const R = 6371 // 지구의 반지름 (km)
  const dLat = toRad(coord2.latitude - coord1.latitude)
  const dLon = toRad(coord2.longitude - coord1.longitude)
  const lat1 = toRad(coord1.latitude)
  const lat2 = toRad(coord2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 도(degree)를 라디안(radian)으로 변환
 */
const toRad = (degree: number): number => {
  return (degree * Math.PI) / 180
}
