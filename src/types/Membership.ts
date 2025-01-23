export enum MembershipStatus {
  ACTIVE = "T",
  INACTIVE = "F",
  EXPIRED = "E",
}

export interface MembershipCategory {
  sc_idx: string
  category_name: string
  category_description?: string
}

export interface MembershipOption {
  ss_idx: string
  option_name: string
  option_count: number
  option_price: number
}

export interface MembershipItem {
  s_idx: string
  service_name: string
  service_time: number
  service_description: string
  service_notice?: string
  service_image_url?: string
  options: MembershipOption[]
}

export interface MembershipDetail {
  s_idx: string
  service_name: string
  service_time: number
  service_description: string
  service_notice?: string
  service_image_url?: string
  brand_name: string
  options: MembershipOption[]
  courses: ServiceCourse[]
  pictures: string[]
}

export interface ServiceCourse {
  sc_idx: string
  sc_name: string
  sc_min: string
  priority: string
}

export interface MyMembership {
  mp_idx: string
  status: string
  service_name: string
  s_type: string
  remain_amount: string
  buy_amount: string
  pay_date: string
  expiration_date: string
}

export interface MyMembershipFilterItem {
  id: MembershipStatus | "-"
  title: string
}

export const myMembershipFilters: MyMembershipFilterItem[] = [
  {
    id: "-",
    title: "전체",
  },
  {
    id: MembershipStatus.ACTIVE,
    title: "사용가능",
  },
  {
    id: MembershipStatus.INACTIVE,
    title: "사용완료",
  },
  {
    id: MembershipStatus.EXPIRED,
    title: "만료됨",
  },
]

export interface AdditionalManagement {
  am_idx: string
  service_name: string
  service_description: string
  service_time: number
  service_price: number
  options: AdditionalManagementOption[]
}

export interface AdditionalManagementOption {
  ams_idx: string
  option_name: string
  option_count: number
  option_price: number
}
