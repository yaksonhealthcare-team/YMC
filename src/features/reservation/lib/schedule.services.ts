import { authApi } from '@/shared/api/instance';
import { GET_SCHEDULES_DATE, GET_SCHEDULES_TIMES } from '@/shared/constants/queryKeys/queryKey.constants';
import { handleError } from '@/shared/lib/utils/error.utils';
import { ApiResponse } from '@/shared/types/response.types';
import { CustomUseQueryOptions } from '@/shared/types/util.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ScheduleDateScheme, SchedulesParams, ScheduleTimeScheme } from '@/entities/schedule/model/schedule.types';

const BASE_URL = `/schedules`;

/**
 * 예약 날짜 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-01d3f441-5d92-4362-ba3d-fab11aaa5fad?action=share&creator=45468383&ctx=documentation
 */
const getSchedulesDate = async (params: SchedulesParams): Promise<AxiosResponse<ApiResponse<ScheduleDateScheme[]>>> => {
  try {
    const endpoint = `${BASE_URL}/date`;

    return await authApi.get(endpoint, { params, paramsSerializer: { indexes: true } });
  } catch (error) {
    throw handleError(error, 'getScheduleDate');
  }
};
export const useGetSchedulesDate = (
  userId: string,
  params: SchedulesParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ScheduleDateScheme[]>>,
    AxiosError,
    ApiResponse<ScheduleDateScheme[]>
  >
) => {
  return useQuery({
    queryKey: [GET_SCHEDULES_DATE, userId, params],
    queryFn: () => getSchedulesDate(params),
    select: ({ data }) => data,
    gcTime: 0,
    staleTime: 0,
    ...options
  });
};

/**
 * 예약 시간 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-5b3a49c0-4061-4b51-a306-66513262e55b?action=share&creator=45468383&ctx=documentation
 */
const getSchedulesTimes = async (
  params: SchedulesParams
): Promise<AxiosResponse<ApiResponse<ScheduleTimeScheme[]>>> => {
  try {
    const endpoint = `${BASE_URL}/times`;

    return await authApi.get(endpoint, { params, paramsSerializer: { indexes: true } });
  } catch (error) {
    throw handleError(error, 'getScheduleTimes');
  }
};
export const useGetSchedulesTimes = (
  userId: string,
  params: SchedulesParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ScheduleTimeScheme[]>>,
    AxiosError,
    ApiResponse<ScheduleTimeScheme[]>
  >
) => {
  return useQuery({
    queryKey: [GET_SCHEDULES_TIMES, userId, params],
    queryFn: () => getSchedulesTimes(params),
    select: ({ data }) => data,
    gcTime: 0,
    staleTime: 0,
    ...options
  });
};
