import { authApi } from '@/_shared';
import { ApiResponse } from '@/apis/address.api';
import { BranchSearchResult } from '@/types/Branch';
import { ListResponse } from '@/types/Common';
import { HTTPResponse } from '@/types/HTTPResponse';
import { CRMUserResponse } from '@/types/User';

export const fetchVisitedStores = async () => {
  const { data } = await authApi.get<ListResponse<BranchSearchResult>>('/me/visited_stores');
  return data;
};

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
