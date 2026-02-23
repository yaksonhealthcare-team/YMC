import { formatPriceKO } from '@/shared/lib/utils/format.utils';
import { MembershipStatus } from '@/features/membership-purchase/model/membership.constants';
import { MembershipGubunType, MembershipStatusType, MembershipStatusValue } from '@/entities/membership/model/membership.types';

export const convertMembershipStatusValue = (value: MembershipStatusValue) => {
  switch (value) {
    case '사용가능':
      return MembershipStatus.ACTIVE;
    case '사용완료':
      return MembershipStatus.INACTIVE;
    case '만료됨':
      return MembershipStatus.EXPIRED;
    default:
      return MembershipStatus.ACTIVE;
  }
};

export const convertMembershipStatusKey = (key: MembershipStatusType) => {
  switch (key) {
    case MembershipStatus.ACTIVE:
      return '사용가능';
    case MembershipStatus.INACTIVE:
      return '사용완료';
    case MembershipStatus.EXPIRED:
      return '만료됨';
    default:
      return '사용가능';
  }
};

/**
 * 정액권, 횟수권에 따라 단위를 '원', '회'로 변환
 */
export const convertMembershipPriceUnit = (gubun: MembershipGubunType, amount: number) => {
  const formattedAmount = formatPriceKO(amount);

  switch (gubun) {
    case 'F':
      return `${formattedAmount}원`;
    case 'M':
      return `${amount}회`;
    default:
      return `${formattedAmount}원`;
  }
};
