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

export const fetchCRMUser = async (
  name: string,
  hp: string,
): Promise<CRMUserResponse> => {
  const { data } = await axiosClient.get<HTTPResponse<CRMUserResponse>>(
    "/me/crm",
    {
      params: {
        name,
        hp,
      },
    },
  )
  return data.body
}

export const postVisitedStore = async (storeId: string) => {
  const response = await axiosClient.post<HTTPResponse<{ message: string }>>(
    "/me/visited_stores",
    { storeId },
  )
  return response.data
}
