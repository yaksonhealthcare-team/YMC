import { ApiResponse, handleError, ResultResponse } from '@/_shared';
import { axiosClient } from '@/queries/clients';
import { AxiosResponse } from 'axios';
import { BranchDetailParams, BranchDetailSchema, BranchesParams, BranchesSchema } from '../types/branch.types';

const BASE_URL = `/branches`;

/**
 * 지점 상세 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-1cd7386a-c3ed-4124-84bb-f6d7f1875d7e?action=share&creator=45468383&ctx=documentation
 */
export const getBranchDetail = async (
  params: BranchDetailParams
): Promise<AxiosResponse<ApiResponse<BranchDetailSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/detail`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBranchesDetail');
  }
};

/**
 * 지점 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-5b61ff5c-d1cd-4bb4-a3e0-0bf579fe2c3b?action=share&creator=45468383&ctx=documentation
 */
export const getBranches = async (params: BranchesParams): Promise<AxiosResponse<ResultResponse<BranchesSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/branches`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBranches');
  }
};
