import { ApiResponse, authApi, handleError } from '@/_shared';
import { AxiosError, AxiosResponse } from 'axios';
import { PopupParams, PopupSchema } from '../types';

const BASE_URL = `/contents`;

/**
 * 팝업 전체 조회
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-e5329f84-e682-44d9-af85-e8afe8c02f82?action=share&source=copy-link&creator=45468383
 */
export const getPopup = async (params: PopupParams): Promise<AxiosResponse<ApiResponse<PopupSchema[]>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/popup`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getPopup');
  }
};
