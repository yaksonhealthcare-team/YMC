import { authApi } from '@/shared/api/instance';
import { ApiResponse } from '@/shared/api/address.api';
import { HTTPResponse } from '@/shared/types/HTTPResponse';
import { CRMUserResponse } from '@/entities/user/model/User';

export const fetchCRMUser = async (name: string, hp: string) => {
  const res = await authApi.get<ApiResponse<CRMUserResponse>>('/me/crm', {
    params: {
      name,
      hp
    }
  });
  return res.data;
};

export const postVisitedStore = async (b_idx: string) => {
  const response = await authApi.post<HTTPResponse<{ message: string }>>('/me/visited_stores', { b_idx });
  return response.data;
};
