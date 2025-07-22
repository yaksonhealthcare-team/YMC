import { ApiResponse, CustomUseMutationOptions, CustomUseQueryOptions } from '@/_shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { CreateReservationBody } from '../../types';
import { ReservationConsultCountSchema, ReservationSchema } from '../../types/reservation.types';
import { createReservation, getReservationCount } from '../reservation.services';

export const useCreateReservationMutation = (
  options?: CustomUseMutationOptions<AxiosResponse<ApiResponse<ReservationSchema>>, AxiosError, CreateReservationBody>
) => {
  return useMutation<AxiosResponse<ApiResponse<ReservationSchema>>, AxiosError, CreateReservationBody>({
    mutationFn: (body: CreateReservationBody) => createReservation(body),
    ...options
  });
};

export const useGetReservationConsultCount = (
  key: string,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ReservationConsultCountSchema>>,
    AxiosError,
    ApiResponse<ReservationConsultCountSchema>
  >
) => {
  return useQuery({
    queryKey: ['consultation-count', key],
    queryFn: () => getReservationCount(),
    select: ({ data }) => data,
    ...options
  });
};
