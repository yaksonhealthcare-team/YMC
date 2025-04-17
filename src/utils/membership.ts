import { MembershipStatus } from "../types/Membership"

/**
 * 멤버십 상태를 나타내는 한글 문자열을 MembershipStatus 열거형 값으로 변환합니다.
 * @param status - 변환할 멤버십 상태 문자열 ("사용가능", "사용완료", "만료됨")
 * @returns 해당하는 MembershipStatus 값. 매칭되는 값이 없으면 MembershipStatus.ACTIVE 반환.
 */
export const getStatusFromString = (status: string): MembershipStatus => {
  switch (status) {
    case "사용가능":
      return MembershipStatus.ACTIVE
    case "사용완료":
      return MembershipStatus.INACTIVE
    case "만료됨":
      return MembershipStatus.EXPIRED
    default:
      console.warn(
        `Unknown membership status string: ${status}, defaulting to ACTIVE`,
      )
      return MembershipStatus.ACTIVE // 기본값 또는 에러 처리 로직
  }
}
