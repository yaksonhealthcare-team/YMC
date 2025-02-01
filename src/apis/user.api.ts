import { ListResponse } from "../types/Common"
import { BranchSearchResult } from "../types/Branch"
import { axiosClient } from "../queries/clients"

export const fetchVisitedStores = async () => {
  const { data } =
    await axiosClient.get<ListResponse<BranchSearchResult>>("/me/visited_stores")
  return data
}
