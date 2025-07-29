import { ApiResponse, CustomUseInfiniteQueryOptions, CustomUseQueryOptions, ResultResponse } from '@/_shared';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { BranchDetailParams, BranchDetailSchema, BranchesParams, BranchesSchema } from '../../types';
import { getBranchDetail, getBranches } from '../branch.services';

export const useGetBranchDetail = (
  key: string,
  params: BranchDetailParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<BranchDetailSchema[]>>,
    AxiosError,
    ApiResponse<BranchDetailSchema[]>
  >
) => {
  return useQuery({
    queryKey: ['get-branch-detail', key, params],
    queryFn: () => getBranchDetail(params),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 5,
    ...options
  });
};

export const useGetBranches = (
  key: string,
  params: BranchesParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ResultResponse<BranchesSchema>>,
    AxiosError,
    AxiosResponse<ResultResponse<BranchesSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: ['get-branches', key, params],
    queryFn: ({ pageParam = 1 }) => getBranches({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};
