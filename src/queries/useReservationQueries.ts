import { cancelReservation } from '@/apis/reservation.api';
import { ReservationStatusCode } from '@/types/Reservation';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserContextQueryKey } from '../queries/queryKeyFactory';

const invalidateAllReservationQueries = (queryClient: QueryClient) => {
  // 모든 예약 관련 상태 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: createUserContextQueryKey(['upcomingReservations'])
  });

  // 전체 예약 리스트 무효화
  queryClient.invalidateQueries({
    queryKey: createUserContextQueryKey(['reservations']),
    exact: false // 모든 하위 키를 무효화
  });

  // 개별 상태별 예약 리스트 무효화
  const statusCodes: ReservationStatusCode[] = ['000', '001', '002', '003', '008'];
  statusCodes.forEach((code) => {
    queryClient.invalidateQueries({
      queryKey: createUserContextQueryKey(['reservations', code])
    });
  });
};

interface CancelReservationParams {
  reservationId: string;
  cancelMemo: string;
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, cancelMemo }: CancelReservationParams) =>
      cancelReservation(reservationId, cancelMemo),
    retry: false,
    onSuccess: (_, variables) => {
      // 예약 상세 정보 무효화
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(['reservationDetail', variables.reservationId])
      });

      // 모든 예약 관련 쿼리 무효화
      invalidateAllReservationQueries(queryClient);
    }
  });
};
