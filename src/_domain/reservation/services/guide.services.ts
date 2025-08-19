import { ApiResponse, authApi, handleError } from '@/_shared';
import { AxiosResponse } from 'axios';
import { GuideMessagesSchema } from '../types';

const BASE_URL = `/guidemessages`;

export const getGuideMessages = async (): Promise<AxiosResponse<ApiResponse<GuideMessagesSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/setting`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getGuideMessages');
  }
};
