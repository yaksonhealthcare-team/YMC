import {
  AdditionalManagementMapper,
  MembershipDetailMapper,
  MembershipMapper,
  MyMembershipMapper,
  ServiceCategoryMapper,
} from "mappers/MembershipMapper"
import { axiosClient } from "queries/clients"
import { HTTPResponse } from "types/HTTPResponse"
import {
  MembershipDetail,
  MembershipDetailResponse,
  ServiceCategoryResponse,
} from "types/Membership"

export const fetchServiceCategories = async (brandCode: string) => {
  const { data } = await axiosClient.get<
    HTTPResponse<ServiceCategoryResponse[]>
  >(`/memberships/categories?brand_code=${brandCode}`)
  return ServiceCategoryMapper.toEntities(data.body)
}

export const fetchMemberships = async (
  brandCode: string,
  scCode: string = "",
  page: number = 1,
) => {
  const { data } = await axiosClient.get(`/memberships/memberships`, {
    params: {
      brand_code: brandCode,
      sc_code: scCode,
      page,
    },
  })
  return MembershipMapper.toEntities(data.body)
}

export const fetchMembershipDetail = async (
  s_idx: string,
): Promise<MembershipDetail> => {
  const { data } = await axiosClient.get<
    HTTPResponse<MembershipDetailResponse>
  >(`/memberships/detail`, {
    params: {
      s_idx,
    },
  })
  return MembershipDetailMapper.toEntity(data.body)
}

export const fetchMyMemberships = async (
  search_type: string,
  page: number = 1,
  page_size: number = 10,
) => {
  const { data } = await axiosClient.get("/memberships/me/me", {
    params: {
      search_type,
      page,
      page_size,
    },
  })
  return MyMembershipMapper.toEntities(data.body)
}

export const fetchAdditionalManagement = async (
  membershipIdx: number | undefined,
  page: number = 1,
) => {
  const { data } = await axiosClient.get(
    "/memberships/additional-managements",
    {
      params: {
        mp_idx: membershipIdx,
        page,
      },
    },
  )
  return AdditionalManagementMapper.toEntities(data.body)
}
