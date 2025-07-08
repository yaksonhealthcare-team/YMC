import { ListResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { axiosClient } from '@/queries/clients';
import { AxiosResponse } from 'axios';
import {
  UserMembershipDetailParams,
  UserMembershipDetailSchema,
  UserMembershipParams,
  UserMembershipSchema
} from '../types/membership.types';

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

    return axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getUserMemberships');
  }
};

/**
 * 사용자의 회원권 상세조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-966df38f-8da0-48d5-9054-c566f488d1f1?action=share&creator=45468383&ctx=documentation
 */
export const getUserMembershipsDetail = async (
  params: UserMembershipDetailParams
): Promise<AxiosResponse<ListResponse<UserMembershipDetailSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/me/detail`;

    return axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getUserMembershipsDetail');
  }
};
