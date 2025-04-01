import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "../types/HTTPResponse"
import { TermsResponse } from "../types/Terms"

export const fetchTerms = async (
  termsCategoryIdx: number = 0,
  isUse: string = "Y",
) => {
  const { data } = await axiosClient.get<HTTPResponse<TermsResponse>>(
    `/auth/signup/terms?terms_category_idx=${termsCategoryIdx}&is_use=${isUse}`,
  )
  return data.body
}
