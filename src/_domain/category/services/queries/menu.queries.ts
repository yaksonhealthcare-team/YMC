import { ListResponse } from '@/_shared/types/response.types';
import { CustomUseInfiniteQueryOptions } from '@/_shared/types/util.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ConsultMenuParams, ConsultMenuSchema } from '../../types/menu.types';
import { getConsultMenu } from '../menu.services';

export const useGetConsultMenu = (
  params: ConsultMenuParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<ConsultMenuSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<ConsultMenuSchema>>[]
  >
) => {
  return useInfiniteQuery<
    AxiosResponse<ListResponse<ConsultMenuSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<ConsultMenuSchema>>[]
  >({
    queryKey: ['get-consultation-memberships', params],
    queryFn: ({ pageParam = 1 }) => getConsultMenu({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};
