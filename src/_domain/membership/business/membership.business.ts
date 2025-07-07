import { ReservationMembershipCardItem } from '@/_domain/reservation/components';
import dayjs from 'dayjs';
import { Location } from 'react-router-dom';
import { MembershipChipProps } from '../components/molecules';
import { MembershipStatusValue, UserMembershipSchema } from '../types/membership.types';
import { convertMembershipPriceUnit, convertMembershipStatusValue } from '../utils';

export type ConvertedMembershipForSwiperData = ReturnType<typeof convertMembershipForSwiper>;
/**
 * ReservationMembershipSwiper에서 사용할 데이터로 변환
 * @return {ConvertedMembershipForSwiperData}
 */
export const convertMembershipForSwiper = (data: UserMembershipSchema[] = [], location?: Location) => {
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

export type ConvertedMembershipForCardData = ReturnType<typeof convertMembershipForCard>;
/**
 * MembershipCard에서 사용할 데이터로 변환
 * @return {ConvertedMembershipForCardData}
 */
export const convertMembershipForCard = (data: UserMembershipSchema[] = []) => {
  return data.map((item) => {
    const convertedRemainAmount = convertMembershipPriceUnit(item.mp_gubun, Number(item.remain_amount));
    const convertedTotalAmount = convertMembershipPriceUnit(item.mp_gubun, Number(item.buy_amount));
    const formattedDate = formatDate(item.pay_date, item.expiration_date);
    const chipData: MembershipChipProps[] = [
      {
        type: 'status',
        value: item.status,
        status: convertMembershipStatusValue(item.status as MembershipStatusValue)
      },
      { type: 'branch', value: item.branchs[0].b_name }
    ];

    return {
      id: item.mp_idx,
      status: item.status,
      serviceName: item.service_name,
      remainAmount: convertedRemainAmount,
      totalAmount: convertedTotalAmount,
      date: formattedDate,
      branch: item.branchs[0],
      chips: chipData
    };
  });
};

const formatDate = (startDate: string, expireDate: string) => {
  const fmt = 'YYYY.MM.DD';
  const parseFmt = 'YYYY-MM-DD HH:mm';

  const start = dayjs(startDate, parseFmt).format(fmt);
  const end = dayjs(expireDate, parseFmt).format(fmt);

  return `${start} - ${end}`;
};
