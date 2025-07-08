import { ListResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { axiosClient } from '@/queries/clients';
import { AxiosResponse } from 'axios';
import { ConsultMenuParams, ConsultMenuSchema, PrepaidMenuParams } from '../types/menu.types';

const BASE_URL = `/memberships`;

/**
 * 상담예약 시 관리메뉴 선택
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-c38b35f1-21b4-4298-b746-37ce45cadd63?action=share&creator=45468383&ctx=documentation
 */
export const getConsultMenu = async (
  params: ConsultMenuParams
): Promise<AxiosResponse<ListResponse<ConsultMenuSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/get-consultation-memberships`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getConsultMenu');
  }
};

/**
 * 정액권 관리메뉴 선택
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-ddbee90f-e162-43db-a497-b158da66b35f?action=share&creator=45468383&ctx=documentation
 */
export const getPrepaidMenu = async (params: PrepaidMenuParams) => {
  try {
    const endpoint = `${BASE_URL}/get-flat-memberships`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getPrepaidMenu');
  }
};
