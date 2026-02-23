import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchMembershipDetail,
  fetchMembershipCategories,
  fetchUserMemberships,
  fetchMembershipList,
  ListResponse
} from './membership.api';
import { MyMembership, MembershipItem } from '@/entities/membership/model/Membership';
import { createUserContextQueryKey } from '@/shared/constants/queryKeys/queryKeyFactory';
import { User } from '@/entities/user/model/User';

export const useMembershipList = (brandCode: string, bIdx?: string, scCode?: string) => {
  return useInfiniteQuery<ListResponse<MembershipItem>>({
    queryKey: ['memberships', brandCode, scCode, bIdx],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchMembershipList(brandCode, bIdx ? Number(bIdx) : undefined, scCode, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (!lastPage.body || lastPage.body.length === 0) return undefined;
      return lastPage.current_page + 1;
    },
    retry: true
  });
};

export const useMembershipDetail = (sIdx: string) => {
  return useQuery({
    queryKey: ['memberships', 'detail', sIdx],
    queryFn: () => fetchMembershipDetail(sIdx),
    enabled: !!sIdx,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: true
  });
};

export const useMembershipCategories = (brandCode: string) => {
  return useQuery({
    queryKey: ['memberships', 'categories', brandCode],
    queryFn: () => fetchMembershipCategories(brandCode),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: true
  });
};

export const useUserMemberships = (searchType?: string, user?: User | null) => {
  return useInfiniteQuery<ListResponse<MyMembership>>({
    queryKey: createUserContextQueryKey(['memberships', searchType]),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchUserMemberships(searchType, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (!lastPage.body || lastPage.body.length === 0) return undefined;
      return lastPage.current_page + 1;
    },
    retry: true,
    enabled: !!user
  });
};
