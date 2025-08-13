import { authApi } from '@/_shared';
import { PointMapper } from '@/mappers/PointMapper';
import { HTTPResponse } from '@/types/HTTPResponse';
import { PointHistoryResponse } from '@/types/Point';

/**
 *
 * @param page
 * Pagination
 * @param sort
 * C: 지급일 순, D: 최근 사용 순
 */
export const fetchPointHistories = async ({ page, sort }: { page: number; sort: 'C' | 'D' }) => {
  const { data } = await authApi.get<HTTPResponse<{ total_point: string; result: PointHistoryResponse[] }>>(
    '/points/history',
    {
      params: {
        page: page,
        search_type: sort
      }
    }
  );

  return {
    currentPage: Number(data.current_page || 0),
    totalPage: Number(data.total_page_count || 0),
    data: PointMapper.toHistoryEntities(data.body.result)
  };
};

export const earnPoints = async (paymentId: string) => {
  const { data } = await authApi.post('/points/earn', {
    p_idx: paymentId
  });

  return data;
};

export const fetchPoints = async () => {
  const { data } = await authApi.get<HTTPResponse<{ total_point: string }>>('/points/points');

  return Number(data.body.total_point.replace(/,/g, ''));
};
