import { authApi } from '@/_shared';
import { HTTPResponse } from '@/types/HTTPResponse';
import { MembershipCategory, MembershipDetail, MembershipItem, MyMembership } from '@/types/Membership';

export interface ListResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: T[];
}

export const fetchMembershipList = async (
  brandCode: string,
  bIdx?: number,
  scCode?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const response = await authApi.get<ListResponse<MembershipItem>>(`/memberships/memberships`, {
    params: {
      brand_code: brandCode,
      b_idx: bIdx,
      sc_code: scCode,
      page,
      page_size: pageSize
    }
  });
  return response.data;
};

export const fetchMembershipDetail = async (sIdx: string) => {
  const response = await authApi.get<HTTPResponse<MembershipDetail>>(`/memberships/detail`, {
    params: {
      s_idx: sIdx
    }
  });
  return response.data.body;
};

export const fetchMembershipCategories = async (brandCode: string) => {
  const response = await authApi.get<ListResponse<MembershipCategory>>(`/memberships/categories`, {
    params: {
      brand_code: brandCode
    }
  });
  return response.data;
};

export const fetchUserMemberships = async (searchType?: string, page: number = 1, pageSize: number = 10) => {
  const response = await authApi.get<ListResponse<MyMembership>>(`/memberships/me/me`, {
    params: {
      search_type: searchType,
      page,
      page_size: pageSize
    }
  });
  return response.data;
};
