/**
 * 금액을 포맷팅하는 유틸리티 함수들
 */

/**
 * 숫자를 한국 통화 형식으로 변환 (1000 -> 1,000)
 */
export const formatPrice = (price: number | string | undefined): string => {
  if (!price) return "0"
  const numPrice =
    typeof price === "string" ? Number(price.replace(/,/g, "")) : price
  return numPrice.toLocaleString()
}

/**
 * 쉼표가 포함된 금액 문자열을 숫자로 변환 ("1,000" -> 1000)
 */
export const parsePrice = (price: string | undefined): number => {
  if (!price) return 0
  return Number(price.replace(/,/g, ""))
}

/**
 * 금액에 원화 표시를 추가 (1000 -> 1,000원)
 */
export const formatPriceWithUnit = (
  price: number | string | undefined,
): string => {
  return `${formatPrice(price)}원`
}

/**
 * 포인트 금액 포맷팅 (1000 -> 1,000P)
 */
export const formatPoint = (point: number | string | undefined): string => {
  return `${formatPrice(point)}P`
}
