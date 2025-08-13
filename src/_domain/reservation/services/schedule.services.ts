import { ApiResponse, authApi, handleError } from '@/_shared';
import { AxiosResponse } from 'axios';
import { ScheduleDateScheme, SchedulesParams, ScheduleTimeScheme } from '../types/schedule.types';

const BASE_URL = `/schedules`;

/**
 * 예약 날짜 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-01d3f441-5d92-4362-ba3d-fab11aaa5fad?action=share&creator=45468383&ctx=documentation
 */
export const getSchedulesDate = async (
  params: SchedulesParams
): Promise<AxiosResponse<ApiResponse<ScheduleDateScheme[]>>> => {
  try {
    const endpoint = `${BASE_URL}/date`;

    return await authApi.get(endpoint, { params, paramsSerializer: { indexes: true } });
  } catch (error) {
    throw handleError(error, 'getScheduleDate');
  }
};

/**
 * 예약 시간 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-5b3a49c0-4061-4b51-a306-66513262e55b?action=share&creator=45468383&ctx=documentation
 */
export const getSchedulesTimes = async (
  params: SchedulesParams
): Promise<AxiosResponse<ApiResponse<ScheduleTimeScheme[]>>> => {
  try {
    const endpoint = `${BASE_URL}/times`;

    return await authApi.get(endpoint, { params, paramsSerializer: { indexes: true } });
  } catch (error) {
    throw handleError(error, 'getScheduleTimes');
  }
};
