import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys"
import { fetchServiceCategories } from "apis/membership.api"
import { ServiceCategory } from "types/Membership"

export const useServiceCategories = (brandCode: string) => {
  return useQuery<ServiceCategory[]>({
    queryKey: queryKeys.memberships.serviceCategories.all(brandCode),
    queryFn: () => fetchServiceCategories(brandCode),
    enabled: !!brandCode,
  })
}
