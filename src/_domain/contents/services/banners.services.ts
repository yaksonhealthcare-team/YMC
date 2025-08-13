import { ApiResponse, authApi, handleError } from '@/_shared';
import { BannerParams, BannerSchema } from '../types/banners.type';
import { AxiosError, AxiosResponse } from 'axios';

const BASE_URL = `/banners`;

export interface BannerResponse extends ApiResponse<BannerSchema> {
  gubun: string;
  use: string;
}

export const getBanners = async (params: BannerParams): Promise<AxiosResponse<BannerResponse, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/banners`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getBanners');
  }
};
