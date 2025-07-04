/**
 * 한국 화폐 단위 포맷
 * @param price 금액
 */
export const formatPriceKO = (price: number) => {
  return price.toLocaleString('ko-KR');
};
