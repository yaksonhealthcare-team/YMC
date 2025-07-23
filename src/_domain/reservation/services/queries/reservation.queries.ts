import { ApiResponse, CustomUseMutationOptions, CustomUseQueryOptions } from '@/_shared';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { CreateReservationBody } from '../../types';
import {
  ReservationConsultCountSchema,
  ReservationDetailParams,
  ReservationDetailSchema,
  ReservationSchema
} from '../../types/reservation.types';
import { createReservation, getReservationCount, getReservationDetail } from '../reservation.services';

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

export const useGetReservationDetail = (
  key: string,
  params: ReservationDetailParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ReservationDetailSchema[]>>,
    AxiosError,
    ApiResponse<ReservationDetailSchema[]>
  >
) => {
  return useSuspenseQuery({
    queryKey: ['reservation-detail', key, params],
    queryFn: () => getReservationDetail(params),
    select: ({ data }) => data,
    ...options
  });
};
