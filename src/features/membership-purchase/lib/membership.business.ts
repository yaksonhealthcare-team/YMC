import { ReservationMembershipCardItem } from '@/features/reservation/ui/ReservationMembershipCard.types';
import { ReservationFormValues, ReservationMembershipType } from '@/entities/reservation/model/reservation.types';
import dayjs from 'dayjs';
import { MembershipChipProps } from '@/widgets/membership-card/ui/MembershipChip.types';
import { MembershipStatusValue, UserMembershipDetailSchema, UserMembershipSchema } from '@/entities/membership/model/membership.types';
import { convertMembershipPriceUnit, convertMembershipStatusValue } from '@/features/membership-purchase/lib/membership.utils';

/**
 * 슬롯 인덱스에 따라:
 * - slotIndex=0: 전체 멤버십을 변환
 * - slotIndex>0: 이전 슬롯에서 standard로 선택된 mp_idx를 제외
 */
export function convertMembershipForSwiperBySlot(
  data: UserMembershipSchema[] = [],
  services: ReservationFormValues['services'] = [],
  slotIndex: number = 0
): ReservationMembershipCardItem[] {
  // 공통 map 함수
  const toCardItem = (item: UserMembershipSchema): ReservationMembershipCardItem => {
    const { mp_idx, mp_gubun, branchs, service_name, pay_date, expiration_date, buy_amount, remain_amount } = item;
    return {
      mp_idx,
      branchId: branchs[0].b_idx,
      branchName: branchs[0].b_name,
      serviceName: service_name,
      startDate: pay_date,
      expireDate: expiration_date,
      remainAmount: remain_amount,
      totalAmount: buy_amount,
      type: (mp_gubun === 'F' ? 'pre-paid' : 'standard') as ReservationMembershipType
    };
  };

  // 0번 슬롯: 원본 data 전체 변환
  if (slotIndex === 0) {
    return data.map(toCardItem);
  }

  // ① 이전 슬롯(0..slotIndex-1)에서 standard & mp_idx 존재하는 것만 뽑아 mp_idx 배열로(횟수권은 추가 예약 대상에서 제외)
  const prevMpIdxs = services
    .slice(0, slotIndex)
    .filter((s) => s.type === 'standard' && !!s.mp_idx)
    .map((s) => s.mp_idx!);

  const excludedSet = new Set(prevMpIdxs);

  // ② 첫번째 슬롯에서 선택된 서비스의 mp_idx로 branchId 추출
  const firstMpIdx = services[0]?.mp_idx;
  const firstItem = data.find((item) => item.mp_idx === firstMpIdx);
  const firstBranchId = firstItem?.branchs[0].b_idx;
  if (!firstBranchId) {
    return [];
  }

  // ③ 같은 branchId인 data만 map → excludedSet에 있으면 제외, 아니면 toCardItem
  return data
    .filter((item) => item.branchs[0].b_idx === firstBranchId && !excludedSet.has(item.mp_idx))
    .map(toCardItem);
}

export type ConvertedMembershipForCardData = ReturnType<typeof convertMembershipForCard>;
/**
 * MembershipCard에서 사용할 데이터로 변환
 * @return {ConvertedMembershipForCardData}
 */
export const convertMembershipForCard = (data: Array<UserMembershipSchema | UserMembershipDetailSchema> = []) => {
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
      id: isUserMembership(item) ? item.mp_idx : '',
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
const isUserMembership = (item: UserMembershipSchema | UserMembershipDetailSchema): item is UserMembershipSchema => {
  return (item as UserMembershipSchema).mp_idx !== undefined;
};
