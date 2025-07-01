import { authApi } from '@/_shared/services';
import { ListResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { AxiosResponse } from 'axios';
import { ConsultMenuParams, ConsultMenuSchema } from '../types/menu.types';

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

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getConsultMenu');
  }
};
