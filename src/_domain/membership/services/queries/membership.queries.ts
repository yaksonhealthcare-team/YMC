import { ListResponse } from '@/_shared/types/response.types';
import { CustomUseInfiniteQueryOptions } from '@/_shared/types/util.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  UserMembershipDetailParams,
  UserMembershipDetailSchema,
  UserMembershipParams,
  UserMembershipSchema
} from '../../types/membership.types';
import { getUserMemberships, getUserMembershipsDetail } from '../membership.services';

export const useGetUserMembership = (
  key: string,
  params: UserMembershipParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<UserMembershipSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<UserMembershipSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: ['get-user-memberships', key, params],
    queryFn: ({ pageParam = 1 }) => getUserMemberships({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};

export const useGetUserMembershipDetail = (
  params: UserMembershipDetailParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<UserMembershipDetailSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<UserMembershipDetailSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: ['get-user-membership-detail', params],
    queryFn: ({ pageParam = 1 }) => getUserMembershipsDetail({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};
