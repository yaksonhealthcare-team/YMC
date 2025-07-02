import { authApi } from '@/_shared/services';
import { ListResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { AxiosResponse } from 'axios';
import { UserMembershipParams, UserMembershipSchema } from '../types/membership.types';

const BASE_URL = `/memberships`;

/**
 * 사용자의 회원권 목록 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-2d5f6602-f511-4154-97b9-322a72b62971?action=share&creator=45468383&ctx=documentation
 */
export const getUserMemberships = async (
  params: UserMembershipParams
): Promise<AxiosResponse<ListResponse<UserMembershipSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/me/me`;

    return authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getUserMemberships');
  }
};
