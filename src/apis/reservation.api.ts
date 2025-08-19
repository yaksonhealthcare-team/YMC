import { ReservationMapper } from '@/mappers/ReservationMapper';
import { HTTPResponse } from '@/types/HTTPResponse';
import { Reservation, ReservationResponse, ReservationStatusCode } from '@/types/Reservation';
import { ApiResponse } from './address.api';
import { authApi } from '@/_shared';

export const fetchReservations = async (
  status: ReservationStatusCode,
  page: number
): Promise<{ reservations: Reservation[]; total_count: number }> => {
  const { data } = await authApi.get<HTTPResponse<ReservationResponse[]>>('/reservation/reservations', {
    params: {
      r_status: status,
      page
    }
  });

  if (data.resultCode !== '00') {
    throw new Error(data.resultMessage || 'API 오류가 발생했습니다.');
  }

  return {
    reservations: ReservationMapper.toReservationEntities(data.body),
    total_count: data.total_count
  };
};

export const completeVisit = async (r_idx: string): Promise<void> => {
  const { data } = await authApi.post<HTTPResponse<null>>('/reservation/complete', {
    r_idx
  });

  if (data.resultCode !== '00') {
    throw new Error(data.resultMessage || 'API 오류가 발생했습니다.');
  }
};

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
