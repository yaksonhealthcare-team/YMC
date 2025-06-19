import { ApiResponse } from '@/apis/address.api';
import { axiosClient } from '@/queries/clients';
import { BranchSearchResult } from '@/types/Branch';
import { ListResponse } from '@/types/Common';
import { HTTPResponse } from '@/types/HTTPResponse';
import { CRMUserResponse } from '@/types/User';

export const fetchVisitedStores = async () => {
  const { data } = await axiosClient.get<ListResponse<BranchSearchResult>>('/me/visited_stores');
  return data;
};

export const fetchCRMUser = async (name: string, hp: string) => {
  const res = await axiosClient.get<ApiResponse<CRMUserResponse>>('/me/crm', {
    params: {
      name,
      hp
    }
  });
  return res.data;
};

export const postVisitedStore = async (b_idx: string) => {
  const response = await axiosClient.post<HTTPResponse<{ message: string }>>('/me/visited_stores', { b_idx });
  return response.data;
};
