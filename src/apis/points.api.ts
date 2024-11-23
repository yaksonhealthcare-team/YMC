import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { PointHistoryDTO } from "../types/dtos/PointDTO.ts"
import { PointMapper } from "../types/dtos/mapper/PointMapper.ts"

/**
 *
 * @param page
 * Pagination
 * @param sort
 * C: 지급일 순, D: 최근 사용 순
 */
export const fetchPointHistories = async ({
  page,
  sort,
}: {
  page: number
  sort: "C" | "D"
}) => {
  const { data } = await axiosClient.get<
    HTTPResponse<{ total_point: string; result: PointHistoryDTO[] }>
  >("/points/history", {
    params: {
      page: page,
      search_type: sort,
    },
  })

  return {
    currentPage: Number(data.current_page || 0),
    totalPage: Number(data.total_page_count || 0),
    data: PointMapper.toHistoryEntities(data.body.result),
  }
}
