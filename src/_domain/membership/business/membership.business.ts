import { ReservationMembershipCardItem } from '@/_domain/reservation/components/organisms/ReservationMembershipCard.types';
import { Location } from 'react-router-dom';
import { UserMembershipSchema } from '../types/membership.types';

export type ConvertedMembershipData = ReturnType<typeof convertMembership>;
/**
 * ReservationMembershipSwiper에서 사용할 데이터로 변환
 * @return {ConvertedMembershipData}
 */
export const convertMembership = (data: UserMembershipSchema[] = [], location?: Location) => {
  const copiedData = [...data];
  const rebookingMembershipId = location?.state?.rebookingMembershipId;
  const params = new URLSearchParams(location?.search);
  const membershipId = params.get('membershipId');

  // 재예약하기로 들어왔을 경우
  if (rebookingMembershipId) {
    copiedData.sort((a, b) => {
      if (a.mp_idx === rebookingMembershipId) return -1;
      if (b.mp_idx === rebookingMembershipId) return 1;
      return 0;
    });
  } else if (membershipId) {
    // 홈 - 보유 회원권 -> 예약하기로 들어왔을 경우
    copiedData.sort((a, b) => {
      if (a.mp_idx === membershipId) return -1;
      if (b.mp_idx === membershipId) return 1;
      return 0;
    });
  }

  const newData: ReservationMembershipCardItem[] = copiedData.map((item) => {
    const { mp_idx, mp_gubun, branchs, service_name, pay_date, expiration_date, buy_amount, remain_amount } = item;

    return {
      id: mp_idx,
      branchName: branchs[0].b_name,
      serviceName: service_name,
      startDate: pay_date,
      expireDate: expiration_date,
      remainAmount: remain_amount,
      totalAmount: buy_amount,
      type: mp_gubun === 'F' ? 'pre-paid' : 'standard'
    };
  });

  return newData;
};
