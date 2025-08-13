import { ApiResponse, CustomUseQueryOptions } from '@/_shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { PopupParams, PopupSchema } from '../../types';
import { getPopup } from '../contents.services';

export const useGetPopup = (
  key: string,
  params: PopupParams,
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<PopupSchema[]>>,
    AxiosError,
    AxiosResponse<ApiResponse<PopupSchema[]>>
  >
) => {
  return useQuery({
    queryKey: ['get-popup', key, params],
    queryFn: () => getPopup(params),
    ...options
  });
};
