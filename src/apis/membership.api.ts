import {
  MembershipMapper,
  ServiceCategoryMapper,
} from "mappers/MembershipMapper"
import { axiosClient } from "queries/clients"
import { HTTPResponse } from "types/HTTPResponse"
import {
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
): Promise<MembershipDetailResponse> => {
  const response = await axiosClient.get<MembershipDetailResponse>(
    `/memberships/detail`,
    {
      params: {
        s_idx,
      },
    },
  )
  return response.data
}
