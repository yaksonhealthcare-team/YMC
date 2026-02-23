import { authApi } from '@/shared/api/instance';
import { GET_RESERVATION_CONSULT_COUNT, GET_RESERVATION_DETAIL, GET_RESERVATIONS } from '@/shared/constants/queryKeys/queryKey.constants';
import { handleError } from '@/shared/lib/utils/error.utils';
import { ApiResponse, ListResponse } from '@/shared/types/response.types';
import { CustomUseInfiniteQueryOptions, CustomUseMutationOptions, CustomUseQueryOptions } from '@/shared/types/util.types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { CreateReservationBody } from '@/entities/reservation/model/reservation.types';
import {
  ReservationConsultCountSchema,
  ReservationDetailParams,
  ReservationDetailSchema,
  ReservationSchema,
  ReservationsParams,
  ReservationsSchema
} from '@/entities/reservation/model/reservation.types';

const BASE_URL = `/reservation`;

/**
 * 예약 생성
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-7fc8a650-497f-49d0-bb8c-532d57d4a948?action=share&creator=45468383&ctx=documentation
 */
const createReservation = async (
  body: CreateReservationBody
): Promise<AxiosResponse<ApiResponse<ReservationSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/reservations`;

    return await authApi.post(endpoint, body);
  } catch (error) {
    throw handleError(error, 'createReservation');
  }
};
export const useCreateReservationMutation = (
  options?: CustomUseMutationOptions<AxiosResponse<ApiResponse<ReservationSchema>>, AxiosError, CreateReservationBody>
) => {
  return useMutation<AxiosResponse<ApiResponse<ReservationSchema>>, AxiosError, CreateReservationBody>({
    mutationFn: (body: CreateReservationBody) => createReservation(body),
    ...options
  });
};

/**
 * 예약 목록 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-78cbb602-b61d-4d6a-84d4-a02a6e5ee8d0?action=share&source=copy-link&creator=45468383
 */
const getReservations = async (params: ReservationsParams) => {
  try {
    const endpoint = `${BASE_URL}/reservations`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getReservations');
  }
};
export const useGetReservations = (
  userId: string,
  params: ReservationsParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ListResponse<ReservationsSchema>>,
    AxiosError,
    AxiosResponse<ListResponse<ReservationsSchema>>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: [GET_RESERVATIONS, userId, params],
    queryFn: ({ pageParam = 1 }) => getReservations({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 18,
    ...options
  });
};

/**
 * 상담 예약 갯수 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-f1bd36bd-bcd3-4b40-871a-abb1b2ae6714?action=share&creator=45468383&ctx=documentation
 */
const getReservationCount = async (): Promise<AxiosResponse<ApiResponse<ReservationConsultCountSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/consultation-count`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getReservationCount');
  }
};
export const useGetReservationConsultCount = (
  userId: string,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ReservationConsultCountSchema>>,
    AxiosError,
    ApiResponse<ReservationConsultCountSchema>
  >
) => {
  return useQuery({
    queryKey: [GET_RESERVATION_CONSULT_COUNT, userId],
    queryFn: () => getReservationCount(),
    select: ({ data }) => data,
    gcTime: 1000 * 60 * 15,
    staleTime: 1000 * 60 * 10,
    ...options
  });
};

/**
 * 상담 예약 상세 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-9b8c2ab5-437b-4727-8b0f-12a6acd5a534?action=share&source=copy-link&creator=45468383
 */
const getReservationDetail = async (
  params: ReservationDetailParams
): Promise<AxiosResponse<ApiResponse<ReservationDetailSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/detail`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getReservationDetail');
  }
};
export const useGetReservationDetail = (
  userId: string,
  params: ReservationDetailParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<ReservationDetailSchema[]>>,
    AxiosError,
    ApiResponse<ReservationDetailSchema[]>
  >
) => {
  return useQuery({
    queryKey: [GET_RESERVATION_DETAIL, userId, params],
    queryFn: () => getReservationDetail(params),
    select: ({ data }) => data,
    gcTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 20,
    ...options
  });
};
