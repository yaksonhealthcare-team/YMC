import axios from "axios"
import {
  MembershipCategory,
  MembershipDetail,
  MembershipItem,
  MyMembership,
  AdditionalManagement,
  MembershipUsageHistory,
} from "../types/Membership"
import { axiosClient } from "../queries/clients"

// 요청 인터셉터 추가
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 추가
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 토큰이 만료되었을 때 (401 에러)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        const response = await axios.post(
          "https://devapi.yaksonhc.com/api/auth/refresh",
          {
            refresh_token: refreshToken,
          },
        )

        const { access_token } = response.data
        localStorage.setItem("accessToken", access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return axiosClient(originalRequest)
      } catch (error) {
        // 리프레시 토큰도 만료되었을 경우
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

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
  scCode?: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const response = await axiosClient.get<ListResponse<MembershipItem>>(
    `/memberships/memberships`,
    {
      params: {
        brand_code: brandCode,
        sc_code: scCode,
        page,
        page_size: pageSize,
      },
    },
  )
  return response.data
}

export const fetchMembershipDetail = async (sIdx: string) => {
  const response = await axiosClient.get<MembershipDetail>(
    `/memberships/detail`,
    {
      params: {
        s_idx: sIdx,
      },
    },
  )
  return response.data
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
        mp_idx: membershipIdx,
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
  const response = await axiosClient.get<ListResponse<MembershipUsageHistory>>(
    `/memberships/me/detail`,
    {
      params: {
        mp_idx: membershipIdx,
        page,
        page_size: pageSize,
      },
    },
  )
  return response.data
}
