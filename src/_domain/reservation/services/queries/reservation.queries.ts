import {
  ApiResponse,
  CustomUseInfiniteQueryOptions,
  CustomUseMutationOptions,
  CustomUseQueryOptions,
  ListResponse
} from '@/_shared';
import { useMutation, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { CreateReservationBody } from '../../types';
import {
  ReservationConsultCountSchema,
  ReservationDetailParams,
  ReservationDetailSchema,
  ReservationSchema,
  ReservationsParams,
  ReservationsSchema
} from '../../types/reservation.types';
import { createReservation, getReservationCount, getReservationDetail, getReservations } from '../reservation.services';

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

export const useGetReservations = (
  key: string,
  params: ReservationsParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<ReservationsSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<ReservationsSchema>>[]
  >
) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['get-reservations', key, params],
    queryFn: ({ pageParam = 1 }) => getReservations({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
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
