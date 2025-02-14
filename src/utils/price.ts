import { AdditionalManagement } from "types/Membership"
import { parsePrice } from "./format"

export const calculateTotalPrice = (
  additionalServices: AdditionalManagement[],
) => {
  return additionalServices.reduce((sum, service) => {
    const optionPrice = service.options?.[0]?.ss_price
    return sum + (optionPrice ? parsePrice(optionPrice) : 0)
  }, 0)
}
