import { ApiResponse, CustomUseQueryOptions } from '@/_shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ScheduleDateScheme } from '../../types';
import { SchedulesParams, ScheduleTimeScheme } from '../../types/schedule.types';
import { getSchedulesDate, getSchedulesTimes } from '../schedule.services';

export const useGetSchedulesDate = (
  key: string,
  params: SchedulesParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ScheduleDateScheme[]>>,
    AxiosError,
    ApiResponse<ScheduleDateScheme[]>
  >
) => {
  return useQuery({
    queryKey: ['schedule-date', key, params],
    queryFn: () => getSchedulesDate(params),
    select: ({ data }) => data,
    ...options
  });
};

export const useGetSchedulesTimes = (
  key: string,
  params: SchedulesParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ScheduleTimeScheme[]>>,
    AxiosError,
    ApiResponse<ScheduleTimeScheme[]>
  >
) => {
  return useQuery({
    queryKey: ['schedule-times', key, params],
    queryFn: () => getSchedulesTimes(params),
    select: ({ data }) => data,
    ...options
  });
};
