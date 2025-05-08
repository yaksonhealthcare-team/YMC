import {
  MembershipCategory,
  MembershipDetail,
  MembershipItem,
  MyMembership,
  AdditionalManagement,
  MembershipDetailWithHistory,
} from "../types/Membership"
import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "types/HTTPResponse"

export interface ListResponse<T> {
  resultCode: string
  resultMessage: string
  resultCount: number
  total_count: number
  total_page_count: number
  current_page: number
  body: T[]
}

export const fetchMembershipList = async (
  brandCode: string,
  bIdx?: number,
  scCode?: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const response = await axiosClient.get<ListResponse<MembershipItem>>(
    `/memberships/memberships`,
    {
      params: {
        brand_code: brandCode,
        b_idx: bIdx,
        sc_code: scCode,
        page,
        page_size: pageSize,
      },
    },
  )
  return response.data
}

export const fetchMembershipDetail = async (sIdx: string) => {
  const response = await axiosClient.get<HTTPResponse<MembershipDetail>>(
    `/memberships/detail`,
    {
      params: {
        s_idx: sIdx,
      },
    },
  )
  return response.data.body
}

export const fetchMembershipCategories = async (brandCode: string) => {
  const response = await axiosClient.get<ListResponse<MembershipCategory>>(
    `/memberships/categories`,
    {
      params: {
        brand_code: brandCode,
      },
    },
  )
  return response.data
}

export const fetchUserMemberships = async (
  searchType?: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const response = await axiosClient.get<ListResponse<MyMembership>>(
    `/memberships/me/me`,
    {
      params: {
        search_type: searchType,
        page,
        page_size: pageSize,
      },
    },
  )
  return response.data
}

export const fetchAdditionalManagement = async (
  membershipIdx: string,
  page: number = 1,
) => {
  const response = await axiosClient.get<ListResponse<AdditionalManagement>>(
    `/memberships/additional-managements`,
    {
      params: {
        s_idx: membershipIdx,
        page,
      },
    },
  )
  return response.data
}

export const fetchMembershipUsageHistory = async (
  membershipIdx: string,
  page: number = 1,
  pageSize: number = 50,
) => {
  const response = await axiosClient.get<
    HTTPResponse<MembershipDetailWithHistory>
  >(`/memberships/me/detail`, {
    params: {
      mp_idx: membershipIdx,
      page,
      page_size: pageSize,
    },
  })

  if (response.data.resultCode !== "00") {
    throw new Error(response.data.resultMessage || "API 오류가 발생했습니다.")
  }

  if (!response.data.body && response.data.resultCode !== "00") {
    throw new Error("회원권 정보를 찾을 수 없습니다.")
  }

  return response.data.body
}
