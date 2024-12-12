export enum MembershipStatus {
  AVAILABLE = "AVAILABLE",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export const membershipStatusLabel: Record<MembershipStatus, string> = {
  [MembershipStatus.AVAILABLE]: "사용가능",
  [MembershipStatus.COMPLETED]: "사용완료",
  [MembershipStatus.EXPIRED]: "만료됨",
}

export type MembershipItem = {
  id: number
  title: string
  count: string
  startAt: string
  endAt: string
  status: MembershipStatus
  isAllBranch?: boolean
  isReady?: boolean
}

export type MembershipFilterId = "all" | MembershipStatus

export const membershipFilters = [
  { id: "all", title: "전체" },
  {
    id: MembershipStatus.AVAILABLE,
    title: membershipStatusLabel[MembershipStatus.AVAILABLE],
  },
  {
    id: MembershipStatus.COMPLETED,
    title: membershipStatusLabel[MembershipStatus.COMPLETED],
  },
  {
    id: MembershipStatus.EXPIRED,
    title: membershipStatusLabel[MembershipStatus.EXPIRED],
  },
] as const

export interface MebershipHistory {
  id: number
  store: string
  date: Date
}

export interface MembershipDetailHistory extends MembershipItem {
  history: MebershipHistory[]
}

export interface AdditionalService {
  id: number
  title: string
  duration: number
  price: number
  selected?: boolean
}

export interface ServiceCategory {
  brandCode: string
  serviceCategoryName: string
  serviceCategoryImageUrl?: string
  serviceCategoryCode: string
  priorirty: string
}

export interface ServiceCategoryResponse {
  brand_code: string
  sc_code: string
  prior: string
  sc_name: string
  sc_pic: string
}

export interface MembershipOption {
  subscriptionIndex: string
  subscriptionCount: string
  subscriptionOriginalPrice: string
  subscriptionPrice: string
}

export interface Membership {
  serviceIndex: string
  serviceName: string
  brandName: string
  serviceTime: string
  serviceType: string
  options: MembershipOption[]
}

export interface MembershipOptionResponse {
  ss_idx: string
  ss_count: string
  original_price: string
  ss_price: string
}

export interface MembershipResponse {
  s_idx: string
  s_name: string
  brand_name: string
  s_time: string
  options: MembershipOptionResponse[]
  s_type: string
}

export interface ServiceCourse {
  serviceCourseIndex: string
  serviceCourseName: string
  serviceCourseMinutes: string
  priority: string
}

export interface MembershipDetail {
  serviceName: string
  brandName: string
  serviceContent: string
  serviceTime: string
  serviceType: string
  courses: ServiceCourse[]
  pictures: string[]
  options: MembershipOption[]
}

export interface ServiceCourseResponse {
  sc_idx: string
  sc_name: string
  sc_min: string
  prior: string
}

export interface MembershipDetailResponse {
  s_name: string
  brand_name: string | null
  s_content: string | null
  s_time: string
  s_type: string
  courses: ServiceCourseResponse[]
  pictures: string[]
  options: MembershipOptionResponse[]
}

export type MyMembershipStatusCode = "-" | "T" | "F" | "E"

export interface MyMembershipResponse {
  mp_idx: string
  remain_amount: string
  buy_amount: string
  pay_date: string
  expiration_date: string
  service_name: string
  s_type: string
  status: MembershipStatus
}

export interface MyMembership {
  id: string
  remainCount: number
  totalCount: number
  purchaseDate: string
  expirationDate: string
  serviceName: string
  serviceType: string
  status: MembershipStatus
}

export interface MyMembershipFilterItem {
  id: MyMembershipStatusCode
  title: string
}

export const myMembershipFilters: MyMembershipFilterItem[] = [
  {
    id: "-",
    title: "전체",
  },
  {
    id: "T",
    title: "사용가능",
  },
  {
    id: "F",
    title: "사용완료",
  },
  {
    id: "E",
    title: "만료됨",
  },
]
