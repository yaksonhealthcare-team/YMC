/**
 * 숫자 관련 유틸리티 함수들
 */

/**
 * 값을 숫자로 변환 (undefined나 invalid인 경우 기본값 반환)
 */
export const toNumber = (
  value: string | number | undefined,
  defaultValue = 0,
): number => {
  if (value === undefined || value === "") return defaultValue
  const num = typeof value === "string" ? Number(value) : value
  return isNaN(num) ? defaultValue : num
}

/**
 * 문자열로 된 개수를 숫자로 변환
 */
export const parseCount = (count: string | undefined): number => {
  return toNumber(count, 0)
}

/**
 * 숫자가 특정 범위 내에 있는지 확인
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * 숫자를 특정 범위 내로 제한
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 퍼센트 계산 (반올림)
 */
export const calculatePercent = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * 할인율 계산 (반올림)
 */
export const calculateDiscountRate = (
  originalPrice: number,
  discountedPrice: number,
): number => {
  if (originalPrice === 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}
