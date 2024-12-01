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

export interface MembershipDetail extends MembershipItem {
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

interface MembershipOptionResponse {
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
