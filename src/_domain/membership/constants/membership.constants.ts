/**
 * 멤버십 사용 상태
 * - ACTIVE: 사용가능
 * - INACTIVE: 사용완료
 * - EXPIRED: 만료됨
 */
export const MembershipStatus = {
  ACTIVE: 'T',
  INACTIVE: 'F',
  EXPIRED: 'E'
} as const;

/**
 * 멤버십 타입
 * - PREPAID: 정액권
 * - STANDARD: 횟수권
 */
export const MembershipType = {
  PREPAID: 'F',
  STANDARD: 'M'
} as const;
