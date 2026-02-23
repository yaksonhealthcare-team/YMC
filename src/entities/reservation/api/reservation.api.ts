import { HTTPResponse } from '@/shared/types/HTTPResponse';
import { ApiResponse } from '@/shared/api/address.api';
import { authApi } from '@/shared/api/instance';

export const cancelReservation = async (reservationId: string, cancelMemo: string): Promise<ApiResponse<null>> => {
  const { data } = await authApi.delete(`/reservation/reservations`, {
    params: {
      r_idx: reservationId,
      cancel_memo: cancelMemo
    }
  });
  return data;
};

export const getConsultationCount = async (): Promise<{
  currentCount: number;
  maxCount: number;
}> => {
  const { data } = await authApi.get<
    HTTPResponse<{
      current_count: string;
      consultation_max_count: string;
    }>
  >('/reservation/consultation-count');

  if (data.resultCode !== '00') {
    throw new Error(data.resultMessage || 'API 오류가 발생했습니다.');
  }

  return {
    currentCount: Number(data.body?.current_count ?? 0),
    maxCount: Number(data.body?.consultation_max_count ?? 0)
  };
};
