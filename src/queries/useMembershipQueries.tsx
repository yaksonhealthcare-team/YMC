import { useQuery } from "@tanstack/react-query"
import {
  fetchMembershipList,
  fetchMembershipDetail,
  fetchMembershipCategories,
  fetchUserMemberships,
  fetchAdditionalManagement,
} from "../apis/membership.api"

export const useMembershipList = (brandCode: string, scCode?: string) => {
  return useQuery({
    queryKey: ["memberships", "list", brandCode, scCode],
    queryFn: () => fetchMembershipList(brandCode, scCode),
  })
}

export const useMembershipDetail = (sIdx: string) => {
  return useQuery({
    queryKey: ["memberships", "detail", sIdx],
    queryFn: () => fetchMembershipDetail(sIdx),
    enabled: !!sIdx,
  })
}

export const useMembershipCategories = (brandCode: string) => {
  return useQuery({
    queryKey: ["memberships", "categories", brandCode],
    queryFn: () => fetchMembershipCategories(brandCode),
  })
}

export const useUserMemberships = (searchType?: string) => {
  return useQuery({
    queryKey: ["memberships", "user", searchType],
    queryFn: () => fetchUserMemberships(searchType),
  })
}

export const useAdditionalManagement = (membershipIdx: string) => {
  return useQuery({
    queryKey: ["memberships", "additional", membershipIdx],
    queryFn: () => fetchAdditionalManagement(membershipIdx),
    enabled: !!membershipIdx,
  })
}
