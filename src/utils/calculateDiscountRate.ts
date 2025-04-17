/**
 * 판매 가격과 원래 가격을 기준으로 할인율을 계산합니다.
 * @param price - 현재 판매 가격
 * @param originalPrice - 할인 전 원래 가격
 * @returns 계산된 할인율 (정수, 반올림 처리)
 */
const calculateDiscountRate = (
  price: number,
  originalPrice: number,
): number => {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export default calculateDiscountRate
