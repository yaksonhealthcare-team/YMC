import {
  ApiResponse,
  authApi,
  CustomUseInfiniteQueryOptions,
  CustomUseQueryOptions,
  handleError,
  ResultResponse
} from '@/_shared';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { BranchDetailParams, BranchDetailSchema, BranchesParams, BranchesSchema } from '../types/branch.types';

const BASE_URL = `/branches`;

/**
 * 지점 상세 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-1cd7386a-c3ed-4124-84bb-f6d7f1875d7e?action=share&creator=45468383&ctx=documentation
 */
const getBranchDetail = async (
  params: BranchDetailParams
): Promise<AxiosResponse<ApiResponse<BranchDetailSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/detail`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBranchesDetail');
  }
};
export const useGetBranchDetail = (
  userId: string,
  params: BranchDetailParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<BranchDetailSchema[]>>,
    AxiosError,
    ApiResponse<BranchDetailSchema[]>
  >
) => {
  return useQuery({
    queryKey: ['get-branch-detail', userId, params],
    queryFn: () => getBranchDetail(params),
    select: ({ data }) => data,
    ...options
  });
};

/**
 * 지점 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-5b61ff5c-d1cd-4bb4-a3e0-0bf579fe2c3b?action=share&creator=45468383&ctx=documentation
 */
const getBranches = async (params: BranchesParams): Promise<AxiosResponse<ResultResponse<BranchesSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/branches`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBranches');
  }
};
export const useGetBranches = (
  userId: string,
  params: BranchesParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ResultResponse<BranchesSchema>>,
    AxiosError,
    AxiosResponse<ResultResponse<BranchesSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: ['get-branches', userId, params],
    queryFn: ({ pageParam = 1 }) => getBranches({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};
