import { MembershipChipProps } from '@/widgets/membership-card/ui/MembershipChip.types';

export interface MembershipCardProps {
  chips: MembershipChipProps[];

  /**
   * 카드 제목
   */
  title: string;

  /**
   * 카드 설명(횟수, 잔여금)
   */
  content: string;

  /**
   * 시작, 만료 날짜
   */
  date?: string;

  /**
   * 카드, 이용내역 클릭 이벤트
   */
  onClick?: () => void;

  /**
   * 예약하기 버튼 클릭 이벤트
   */
  onClickReservation?: () => void;
}
