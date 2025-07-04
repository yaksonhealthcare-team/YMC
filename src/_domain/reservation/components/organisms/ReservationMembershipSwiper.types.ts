import { ReservationMembershipCardItem } from './ReservationMembershipCard.types';

export interface ReservationMembershipSwiperProps {
  data: ReservationMembershipCardItem[];

  /**
   * 라디오 버튼으로 선택된 값, 상태로 핸들링 해주세요
   */
  value?: string;

  /**
   * 라디오 버튼 선택 이벤트
   */
  onChange: (checked: boolean, value: string, item: ReservationMembershipCardItem) => void;
}
