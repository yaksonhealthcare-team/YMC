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
  title: string
  count: string
  startAt: string
  endAt: string
  status: MembershipStatus
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
