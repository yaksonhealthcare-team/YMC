import { MembershipGubunType } from '@/_domain/membership';
import dayjs from 'dayjs';
import { TimeSlot } from './schedule.types';

export interface CreateReservationBody {
  /**
   * 예약 구분
   * - R: 예약
   * - C: 상담
   */
  r_gubun: 'R' | 'C';

  /**
   * 지점 아이디
   */
  b_idx: string;

  /**
   * 예약 일자
   */
  r_date: string;

  /**
   * 예약 시간
   */
  r_stime: string;

  /**
   * 예약 회원권들
   * 회원권일 때 사용
   */
  services?: ReservationService[];

  /**
   * 요청사항
   */
  r_memo?: string;
}
/**
 * 예약 회원권
 */
export interface ReservationService {
  ss_idx?: string;
  mp_idx?: string;
  name?: string;
  price?: string;
  type?: ReservationMembershipType;
}
export interface ConsultReservationService extends Omit<ReservationService, 'type'> {
  type: ConsultReservationType;
}
export interface ReservationSchema {
  /**
   * 예약 아이디
   */
  r_idx: string;
}
export interface ReservationsSchema {
  r_idx: string;
  b_name: string;
  r_date: string;
  remaining_days: string;
  visit: string;
  mp_gubun: MembershipGubunType;
  ps_name: string;
  r_take_time: string;
  r_status: string;
  r_status_code: ReservationStatusCode;
  review_positive_yn: string;
}
export interface ReservationDetailSchema {
  r_idx: string;
  r_gubun: string;
  b_idx: string;
  b_name: string;
  b_lat: string;
  b_lon: string;
  b_tel: string;
  b_addr: string;
  r_date: string;
  p_idx: string;
  mp_idx: string;
  mp_gubun: MembershipGubunType;
  ps_name: string;
  r_take_time: string;
  visit: string;
  r_status: ReservationStatusCode;
  r_status_code: ReservationStatusCode;
  r_memo: string;
  s_name: string;
  buy_amount: string;
  remain_amount: string;
  remaining_days: string;
  review_positive_yn: string;
  add_services: ReservationAddService[];
}
export interface ReservationConsultCountSchema {
  current_count: string;
  consultation_max_count: string;
}
export interface ReservationsParams {
  r_status: ReservationStatusCode;
  page?: number;
  page_size?: number;
}
export interface ReservationDetailParams {
  r_idx: string;
}
export type ReservationMembershipType = 'pre-paid' | 'standard';
export type ReservationType = 'consult' | 'membership';
export type ConsultReservationType = 'only_consult' | 'add_menu';
export interface ReservationFormValues {
  /**
   * 예약 타입
   */
  type?: ReservationType;

  /**
   * 지점
   */
  branch?: ReservationBranch;

  /**
   * 상담 메뉴
   */
  consultService: ConsultReservationService[];

  /**
   * 회원권 메뉴
   */
  services: ReservationService[];

  /**
   * 예약 일자
   */
  date: dayjs.Dayjs | null;

  /**
   * 예약 시간
   */
  timeSlot: TimeSlot;

  /**
   * 요청사항
   */
  request?: string;
}
export interface ReservationBranch {
  id: string;
  name: string;
}
export interface ReservationAddService {
  ps_name: string;
  s_name: string;
  total_price: string;
}
export type ReservationStatusCode =
  | '000' // 전체
  | '001' // 예약완료
  | '002' // 방문완료
  | '003' // 예약취소
  | '008'; // 관리중

/*************************/
/********타입가드 함수*******/
/************************/
export const isReservationType = (v: string): v is ReservationType => {
  return v === 'consult' || v === 'membership';
};
export const isConsultReservationType = (v: string): v is ConsultReservationType => {
  return v === 'only_consult' || v === 'add_menu';
};
