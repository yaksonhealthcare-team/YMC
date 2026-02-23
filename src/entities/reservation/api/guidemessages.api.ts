import { authApi } from '@/_shared';
import { HTTPResponse } from '@/shared/types/HTTPResponse';

// 가이드 메시지 응답 타입 정의
export interface GuideMessage {
  payment_key: string;
  payment_msg: string;
  payment_cancel_key: string;
  payment_cancel_msg: string;
  reserve_key: string;
  reserve_msg: string;
  reserve_cancel_key: string;
  reserve_cancel_msg: string;
  withdrawal_key: string;
  withdrawal_msg: string;
}

/**
 * 가이드 메시지 설정을 가져오는 API
 * @returns 가이드 메시지 설정
 */
export const fetchGuideMessages = async (): Promise<GuideMessage> => {
  const { data } = await authApi.get<HTTPResponse<GuideMessage[]>>('/guidemessages/setting');

  // 응답의 body는 배열 형태이지만 첫 번째 항목만 사용
  return data.body[0];
};
