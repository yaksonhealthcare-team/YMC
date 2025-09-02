import { authApi, CustomUseInfiniteQueryOptions, GET_CONTENTS, handleError } from '@/_shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ContentsParams } from '../types';
import { ContentsResponse } from '../types/contents.types';

const BASE_URL = `/contents`;

/**
 * 콘텐츠 조회
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-095809c2-7215-4ce1-b6bb-8c39f7597b1c?action=share&source=copy-link&creator=45468383
 */
const getContents = async (params: ContentsParams): Promise<AxiosResponse<ContentsResponse, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/contents`;

    return await authApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getContents');
  }
};
export const useGetContents = (
  key: string,
  params: ContentsParams,
  options?: CustomUseInfiniteQueryOptions<
    AxiosResponse<ContentsResponse, AxiosError>,
    AxiosError,
    AxiosResponse<ContentsResponse, AxiosError>[]
  >
) => {
  return useInfiniteQuery({
    queryKey: [GET_CONTENTS, key, params],
    queryFn: ({ pageParam = 1 }) => getContents({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.current_page < lastPage.data.total_page_count ? lastPage.data.current_page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page),
    ...options
  });
};
