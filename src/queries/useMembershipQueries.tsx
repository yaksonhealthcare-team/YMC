import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import {
  fetchMembershipDetail,
  fetchMembershipCategories,
  fetchUserMemberships,
  fetchAdditionalManagement,
  fetchMembershipList,
  ListResponse,
} from "../apis/membership.api"
import { MyMembership, MembershipItem } from "../types/Membership"

export const useMembershipList = (brandCode: string, scCode?: string) => {
  return useInfiniteQuery<ListResponse<MembershipItem>>({
    queryKey: ["memberships", brandCode, scCode],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchMembershipList(brandCode, scCode, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (!lastPage.body || lastPage.body.length === 0) return undefined
      return lastPage.current_page + 1
    },
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

export const useUserMemberships = (searchType?: string) => {
  return useInfiniteQuery<ListResponse<MyMembership>>({
    queryKey: ["memberships", "user", searchType],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchUserMemberships(searchType, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (!lastPage.body || lastPage.body.length === 0) return undefined
      return lastPage.current_page + 1
    },
    staleTime: 30 * 1000, // 30초
    gcTime: 1 * 60 * 1000, // 1분
  })
}

export const useAdditionalManagement = (membershipIdx?: string) => {
  return useQuery({
    queryKey: ["memberships", "additional", membershipIdx],
    queryFn: () => {
      if (!membershipIdx) {
        throw new Error("membershipIdx is required")
      }
      return fetchAdditionalManagement(membershipIdx)
    },
    enabled: !!membershipIdx,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
