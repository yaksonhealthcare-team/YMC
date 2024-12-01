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
