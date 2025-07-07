import { MembershipStatus } from '../constants';
import { MembershipType } from '../constants/membership.constants';

export interface UserMembershipParams {
  /**
   * 검색 타입
   * '': 전체
   * T: 사용가능
   * F: 사용완료
   * E: 만료
   */
  search_type: '' | MembershipStatusType;

  /**
   * 페이지 숫자
   */
  page?: number;
}

export interface UserMembershipSchema {
  /**
   * 회원권 일련번호
   */
  mp_idx: string;

  /**
   * 상태
   */
  status: string;

  /**
   * 회원권 이름
   */
  service_name: string;

  s_type: string;

  /**
   * 지점 정보
   */
  branchs: Branch[];

  /**
   * 남은 금액
   */
  remain_amount: string;

  /**
   * 구매한 금액
   */
  buy_amount: string;

  /**
   * 결제일
   */
  pay_date: string;

  /**
   * 만료일
   */
  expiration_date: string;

  /**
   * 회원권 구분
   * F: 정액권
   * M: 횟수권
   */
  mp_gubun: MembershipGubunType;
}

/**
 * 지점
 */
export interface Branch {
  /**
   * 지점 ID
   */
  b_idx: string;

  /**
   * 지점 이름
   */
  b_name: string;
}

export type MembershipStatusValue = '사용가능' | '사용완료' | '만료됨';
export type MembershipStatusType = (typeof MembershipStatus)[keyof typeof MembershipStatus];
export type MembershipGubunType = (typeof MembershipType)[keyof typeof MembershipType];
