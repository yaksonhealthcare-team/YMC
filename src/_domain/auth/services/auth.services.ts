import { api } from '@/_shared/services';
import { ApiResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { AxiosError, AxiosResponse } from 'axios';
import { CryptoTokenReissueSchema } from '../types/auth.types';

const BASE_URL = `/auth`;

/**
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-993ebd2e-fe67-4c78-a024-f97e393798d9?action=share&creator=45468383&ctx=documentation
 */
export const refreshAccessToken = async (): Promise<
  AxiosResponse<ApiResponse<CryptoTokenReissueSchema>, AxiosError>
> => {
  try {
    const endpoint = `${BASE_URL}/crypto/tokenreissue.php`;

    return await api.get(endpoint);
  } catch (error) {
    throw handleError(error, 'refreshAccessToken');
  }
};
