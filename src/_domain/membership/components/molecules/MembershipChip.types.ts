import { MembershipStatusType } from '../../types';

export type MembershipChipType = 'branch' | 'status';

export interface MembershipChipProps {
  /**
   * 지점 / 사용 여부
   */
  type: MembershipChipType;

  /**
   * 값
   */
  value: string;

  /**
   * 사용 상태 값
   */
  status?: MembershipStatusType;
}
