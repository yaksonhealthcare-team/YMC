import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import {
  fetchMembershipList,
  fetchMembershipDetail,
  fetchMembershipCategories,
  fetchUserMemberships,
  fetchAdditionalManagement,
  ListResponse,
} from "../apis/membership.api"
import { MyMembership } from "../types/Membership"

export const useMembershipList = (brandCode: string, scCode?: string) => {
  return useQuery({
    queryKey: ["memberships", "list", brandCode, scCode],
    queryFn: () => fetchMembershipList(brandCode, scCode),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export const useMembershipDetail = (sIdx: string) => {
  return useQuery({
    queryKey: ["memberships", "detail", sIdx],
    queryFn: () => fetchMembershipDetail(sIdx),
    enabled: !!sIdx,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export const useMembershipCategories = (brandCode: string) => {
  return useQuery({
    queryKey: ["memberships", "categories", brandCode],
    queryFn: () => fetchMembershipCategories(brandCode),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export const useUserMemberships = (
  searchType?: string,
  options?: Omit<
    UseQueryOptions<ListResponse<MyMembership>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["memberships", "user", searchType],
    queryFn: () => fetchUserMemberships(searchType),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  })
}

export const useAdditionalManagement = (membershipIdx: string) => {
  return useQuery({
    queryKey: ["memberships", "additional", membershipIdx],
    queryFn: () => fetchAdditionalManagement(membershipIdx),
    enabled: !!membershipIdx,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
