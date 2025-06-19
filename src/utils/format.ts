/**
 * 금액을 포맷팅하는 유틸리티 함수들
 */

/**
 * 숫자를 한국 통화 형식 문자열로 변환합니다. (예: 1000 -> "1,000")
 * 쉼표(,)를 제거하고 숫자로 변환 후 포맷팅합니다.
 * @param price - 변환할 가격 (숫자, 문자열, 또는 undefined)
 * @returns 포맷팅된 가격 문자열. 유효하지 않은 경우 "0".
 */
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null || price === '') {
    return '0';
  }
  const numPrice = typeof price === 'string' ? Number(price.replace(/,/g, '')) : price;

  if (isNaN(numPrice)) {
    console.warn('Invalid price value for formatting:', price);
    return '0';
  }
  return numPrice.toLocaleString('ko-KR'); // 한국 로케일 명시
};

/**
 * 쉼표가 포함된 가격 문자열을 숫자로 변환합니다. (예: "1,000" -> 1000)
 * @param price - 변환할 가격 문자열
 * @returns 변환된 숫자 가격. 유효하지 않은 경우 0.
 */
export const parsePrice = (price: string | undefined): number => {
  if (price === undefined || price === null || price === '') {
    return 0;
  }
  const num = Number(price.replace(/,/g, ''));
  if (isNaN(num)) {
    console.warn('Invalid price string for parsing:', price);
    return 0;
  }
  return num;
};

/**
 * 가격을 한국 통화 형식 문자열에 '원' 단위를 붙여 반환합니다. (예: 1000 -> "1,000원")
 * @param price - 변환할 가격 (숫자, 문자열, 또는 undefined)
 * @returns '원' 단위가 포함된 포맷팅된 가격 문자열.
 */
export const formatPriceWithUnit = (price: number | string | undefined): string => {
  return `${formatPrice(price)}원`;
};

/**
 * 포인트를 한국 통화 형식 문자열에 'P' 단위를 붙여 반환합니다. (예: 1000 -> "1,000P")
 * @param point - 변환할 포인트 (숫자, 문자열, 또는 undefined)
 * @returns 'P' 단위가 포함된 포맷팅된 포인트 문자열.
 */
export const formatPoint = (point: number | string | undefined): string => {
  return `${formatPrice(point)}P`;
};
