import { authApi, CustomUseInfiniteQueryOptions, GET_USER_MEMBERSHIP_DETAIL, GET_USER_MEMBERSHIPS } from '@/_shared';
import { ListResponse } from '@/shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  UserMembershipDetailParams,
  UserMembershipDetailSchema,
  UserMembershipParams,
  UserMembershipSchema
} from '@/entities/membership/model/membership.types';

const BASE_URL = `/memberships`;

/**
 * 사용자의 회원권 목록 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-2d5f6602-f511-4154-97b9-322a72b62971?action=share&creator=45468383&ctx=documentation
 */
const getUserMemberships = async (
  params: UserMembershipParams
): Promise<AxiosResponse<ListResponse<UserMembershipSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/me/me`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getUserMemberships');
  }
};
export const useGetUserMemberships = (
  userId: string,
  params: UserMembershipParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<UserMembershipSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<UserMembershipSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: [GET_USER_MEMBERSHIPS, userId, params],
    queryFn: ({ pageParam = 1 }) => getUserMemberships({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    gcTime: 0,
    staleTime: 0,
    ...options
  });
};

/**
 * 사용자의 회원권 상세조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-966df38f-8da0-48d5-9054-c566f488d1f1?action=share&creator=45468383&ctx=documentation
 */
const getUserMembershipsDetail = async (
  params: UserMembershipDetailParams
): Promise<AxiosResponse<ListResponse<UserMembershipDetailSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/me/detail`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getUserMembershipsDetail');
  }
};
export const useGetUserMembershipDetail = (
  userId: string,
  params: UserMembershipDetailParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<UserMembershipDetailSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<UserMembershipDetailSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: [GET_USER_MEMBERSHIP_DETAIL, userId, params],
    queryFn: ({ pageParam = 1 }) => getUserMembershipsDetail({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 18,
    ...options
  });
};
