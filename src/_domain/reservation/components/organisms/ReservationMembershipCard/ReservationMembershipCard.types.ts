import { ReservationMembershipType } from '@/_domain/reservation/types/reservation.types';
import { RadioButtonProps } from '@/_shared/components';

export interface ReservationMembershipCardProps {
  data: ReservationMembershipCardItem;
  checked?: RadioButtonProps['checked'];
  onChange?: RadioButtonProps['onChange'];
}

export interface ReservationMembershipCardItem {
  /**
   * 회원권 아이디
   */
  mp_idx: string;

  /**
   * 지점 아이디
   */
  branchId: string;

  /**
   * 지점명
   */
  branchName: string;

  /**
   * 회원권 이름
   */
  serviceName: string;

  /**
   * 시작일
   */
  startDate: string;

  /**
   * 만료일
   */
  expireDate: string;

  /**
   * 남은 금액
   */
  remainAmount: string;

  /**
   * 총 금액
   */
  totalAmount: string;

  /**
   * 회원권 타입
   * @default standard
   * - pre-paid: 정액권
   * - standard: 횟수권(기본)
   */
  type?: ReservationMembershipType;
}
