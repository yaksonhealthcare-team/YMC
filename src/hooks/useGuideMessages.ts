import { fetchGuideMessages, GuideMessage } from '@/entities/reservation/api/guidemessages.api';
import { useQuery } from '@tanstack/react-query';

/**
 * 가이드 메시지를 가져오는 훅
 * @returns 가이드 메시지 쿼리 객체
 */
export const useGuideMessages = () => {
  return useQuery<GuideMessage>({
    queryKey: ['guideMessages'],
    queryFn: fetchGuideMessages,
    staleTime: 1000 * 60 * 60 // 1시간 동안 캐싱
  });
};

/**
 * 결제 관련 가이드 메시지를 가져오는 훅
 * @returns 결제 관련 가이드 메시지 객체
 */
export const usePaymentGuideMessages = () => {
  const { data, isLoading, error } = useGuideMessages();

  return {
    isLoading,
    error,
    paymentMessage: data?.payment_msg || '',
    paymentCancelMessage: data?.payment_cancel_msg || ''
  };
};

/**
 * 예약 관련 가이드 메시지를 가져오는 훅
 * @returns 예약 관련 가이드 메시지 객체
 */
export const useReservationGuideMessages = () => {
  const { data, isLoading, error } = useGuideMessages();

  return {
    isLoading,
    error,
    reservationMessage: data?.reserve_msg || '',
    reservationCancelMessage: data?.reserve_cancel_msg || ''
  };
};

/**
 * 회원 탈퇴 관련 가이드 메시지를 가져오는 훅
 * @returns 회원 탈퇴 관련 가이드 메시지 객체
 */
export const useWithdrawalGuideMessage = () => {
  const { data, isLoading, error } = useGuideMessages();

  return {
    isLoading,
    error,
    withdrawalMessage: data?.withdrawal_msg || ''
  };
};
