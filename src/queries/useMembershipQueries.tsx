import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys"
import {
  fetchMembershipDetail,
  fetchMemberships,
  fetchServiceCategories,
} from "apis/membership.api"
import { ServiceCategory } from "types/Membership"
import { MembershipDetailMapper } from "mappers/MembershipMapper"

export const useServiceCategories = (brandCode: string) => {
  return useQuery<ServiceCategory[]>({
    queryKey: queryKeys.memberships.serviceCategories(brandCode),
    queryFn: () => fetchServiceCategories(brandCode),
    enabled: !!brandCode,
  })
}

export const useMemberships = (brandCode: string, scCode: string) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.memberships.list(brandCode, scCode),
    queryFn: ({ pageParam = 1 }) =>
      fetchMemberships(brandCode, scCode, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })
}

export const useMembershipDetail = (serviceIndex: string) => {
  return useQuery({
    queryKey: queryKeys.memberships.detail(serviceIndex),
    queryFn: async () => {
      const response = await fetchMembershipDetail(serviceIndex)
      return MembershipDetailMapper.toEntity(response)
    },
    enabled: !!serviceIndex,
  })
}
