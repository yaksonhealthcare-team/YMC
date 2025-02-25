import { ListResponse } from "../types/Common"
import { BranchSearchResult } from "../types/Branch"
import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "../types/HTTPResponse"
import { CRMUserResponse } from "../types/User"

export const fetchVisitedStores = async () => {
  const { data } =
    await axiosClient.get<ListResponse<BranchSearchResult>>(
      "/me/visited_stores",
    )
  return data
}

export const fetchCRMUser = async (): Promise<CRMUserResponse> => {
  const { data } =
    await axiosClient.get<HTTPResponse<CRMUserResponse>>("/me/crm")
  return data.body
}
