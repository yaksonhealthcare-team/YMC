import { ListResponse } from "../types/Common"
import { BranchResponse } from "../types/Branch"
import { axiosClient } from "../queries/clients"

export const fetchVisitedStores = async () => {
  const { data } =
    await axiosClient.get<ListResponse<BranchResponse>>("/me/visited_stores")
  return data
}
