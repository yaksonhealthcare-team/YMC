import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "../types/HTTPResponse"

export interface DecryptRequest {
  token_version_id: string
  di: string
}

export interface FindEmailResponse {
  thirdPartyType?: string // 이메일 또는 소셜로그인 유형
  email?: string // 로그인 유형이 이메일인 경우에만 존재
}

export const findEmailWithDecryptData = async (
  request: DecryptRequest,
): Promise<FindEmailResponse> => {
  const { data } = await axiosClient.post<HTTPResponse<FindEmailResponse[]>>(
    "/auth/account/find-account",
    { ...request },
  )
  return data.body[0]
}

export interface ChangePhoneNumberResponse {}

export const changePhoneNumberWithDecryptData = async (
  request: DecryptRequest,
): Promise<ChangePhoneNumberResponse> => {
  const { data } = await axiosClient.post<
    HTTPResponse<ChangePhoneNumberResponse>
  >("/auth/account/change-phone-number", { ...request })

  return data
}
