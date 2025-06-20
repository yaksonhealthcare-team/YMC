/**
 * 숫자 관련 유틸리티 함수 모음입니다.
 */

/**
 * 주어진 값을 숫자로 변환합니다.
 * 변환할 수 없거나 값이 undefined, 빈 문자열인 경우 기본값을 반환합니다.
 * @param value - 변환할 값 (문자열, 숫자, 또는 undefined).
 * @param defaultValue - 변환 실패 시 반환할 기본값 (기본값: 0).
 * @returns 변환된 숫자 또는 기본값.
 */
export const toNumber = (value: string | number | undefined, defaultValue = 0): number => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  // 문자열인 경우 쉼표 제거 후 숫자로 변환 시도
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (isNaN(num)) {
    console.warn('toNumber: Could not convert value to number:', value);
    return defaultValue;
  }
  return num;
};

/**
 * 문자열 형태의 개수를 숫자로 변환합니다.
 * 유효하지 않은 경우 0을 반환합니다.
 * @param count - 변환할 개수 문자열.
 * @returns 변환된 숫자 개수. 유효하지 않으면 0.
 */
export const parseCount = (count: string | undefined): number => {
  return toNumber(count, 0);
};

/**
 * 주어진 숫자가 특정 범위 내에 있는지 확인합니다. (경계값 포함)
 * @param value - 확인할 숫자.
 * @param min - 최소값.
 * @param max - 최대값.
 * @returns 범위 내에 있으면 true, 아니면 false.
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 숫자를 지정된 최소값과 최대값 사이로 제한합니다.
 * @param value - 제한할 숫자.
 * @param min - 최소 허용값.
 * @param max - 최대 허용값.
 * @returns 제한된 범위 내의 숫자.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 전체값 대비 특정 값의 백분율을 계산합니다.
 * 결과는 정수로 반올림됩니다.
 * @param value - 백분율을 계산할 값.
 * @param total - 전체 값.
 * @returns 계산된 백분율 (정수). 전체 값이 0이면 0을 반환.
 */
export const calculatePercent = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * 원가와 할인가를 기준으로 할인율(%)을 계산합니다.
 * 결과는 정수로 반올림됩니다.
 * @param originalPrice - 원래 가격 (원가).
 * @param discountedPrice - 할인된 가격.
 * @returns 계산된 할인율 (정수). 원가가 0이면 0을 반환.
 */
export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice === 0) {
    console.warn('calculateDiscountRate: Original price is zero.');
    return 0;
  }
  if (discountedPrice > originalPrice) {
    console.warn('calculateDiscountRate: Discounted price is greater than original price.');
    // 할인가가 원가보다 높으면 할인율 0 또는 음수 반환 고려
  }
  const discount = originalPrice - discountedPrice;
  return Math.round((discount / originalPrice) * 100);
};
