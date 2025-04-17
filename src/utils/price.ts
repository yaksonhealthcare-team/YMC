import { AdditionalManagement } from "types/Membership"
import { parsePrice } from "./format"

/**
 * 추가 서비스 목록의 총 가격을 계산합니다.
 * 각 서비스의 첫 번째 옵션 가격을 기준으로 합산합니다.
 * @param additionalServices - 가격을 계산할 추가 서비스 목록 배열.
 * @returns 계산된 총 가격 (숫자).
 */
export const calculateTotalPrice = (
  additionalServices: AdditionalManagement[] | undefined,
): number => {
  if (!additionalServices) {
    return 0
  }
  return additionalServices.reduce((sum, service) => {
    // service.options가 배열이고, 첫 번째 요소가 존재하며, ss_price가 있는지 확인
    const optionPrice = service.options?.[0]?.ss_price
    // optionPrice가 유효한 경우 parsePrice를 호출, 아니면 0을 더함
    return sum + (optionPrice ? parsePrice(optionPrice) : 0)
  }, 0)
}
