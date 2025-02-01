import { MembershipStatus } from "../types/Membership"

export const getStatusFromString = (status: string): MembershipStatus => {
  switch (status) {
    case "사용가능":
      return MembershipStatus.ACTIVE
    case "사용완료":
      return MembershipStatus.INACTIVE
    case "만료됨":
      return MembershipStatus.EXPIRED
    default:
      return MembershipStatus.ACTIVE
  }
} 