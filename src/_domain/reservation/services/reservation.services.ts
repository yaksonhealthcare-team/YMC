import { ApiResponse, handleError } from '@/_shared';
import { axiosClient } from '@/queries/clients';
import { AxiosResponse } from 'axios';
import { CreateReservationBody } from '../types';
import {
  ReservationConsultCountSchema,
  ReservationDetailParams,
  ReservationDetailSchema,
  ReservationSchema,
  ReservationsParams
} from '../types/reservation.types';

const BASE_URL = `/reservation`;

/**
 * 예약 생성
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-7fc8a650-497f-49d0-bb8c-532d57d4a948?action=share&creator=45468383&ctx=documentation
 */
export const createReservation = async (
  body: CreateReservationBody
): Promise<AxiosResponse<ApiResponse<ReservationSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/reservations`;

    return await axiosClient.post(endpoint, body);
  } catch (error) {
    throw handleError(error, 'createReservation');
  }
};

/**
 * 예약 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-78cbb602-b61d-4d6a-84d4-a02a6e5ee8d0?action=share&source=copy-link&creator=45468383
 */
export const getReservations = async (params: ReservationsParams) => {
  try {
    const endpoint = `${BASE_URL}/reservations`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getReservations');
  }
};

/**
 * 상담 예약 갯수 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-f1bd36bd-bcd3-4b40-871a-abb1b2ae6714?action=share&creator=45468383&ctx=documentation
 */
export const getReservationCount = async (): Promise<AxiosResponse<ApiResponse<ReservationConsultCountSchema>>> => {
  try {
    const endpoint = `${BASE_URL}/consultation-count`;

    return axiosClient.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getReservationCount');
  }
};

/**
 * 상담 예약 상세 조회
 * @link https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-9b8c2ab5-437b-4727-8b0f-12a6acd5a534?action=share&source=copy-link&creator=45468383
 */
export const getReservationDetail = async (
  params: ReservationDetailParams
): Promise<AxiosResponse<ApiResponse<ReservationDetailSchema[]>>> => {
  try {
    const endpoint = `${BASE_URL}/detail`;

    return await axiosClient.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getReservationDetail');
  }
};
