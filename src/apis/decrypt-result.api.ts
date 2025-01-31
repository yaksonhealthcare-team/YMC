import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "../types/HTTPResponse"

export interface DecryptRequest {
  token_version_id: string
  enc_data: string
  integrity_value: string
}

export interface DecryptResponse {
  name: string
  hp: string
  birthdate: string
  sex: string
  nationalitytype: string
  tokenversion_id: string
  di: string
}

export interface FindEmailResponse {
  thirdPartyType?: string    // 이메일 또는 소셜로그인 유형
  email?: string       // 로그인 유형이 이메일인 경우에만 존재
}

export const fetchDecryptResult = async (request: DecryptRequest) => {
  const { data } = await axiosClient.post<HTTPResponse<DecryptResponse>>(
    "/auth/decrypt/result.php",
    { ...request },
  )

  return data
}

export const findEmailWithDecryptData = async (request: DecryptRequest): Promise<FindEmailResponse> => {
  const { data } = await axiosClient.post<HTTPResponse<FindEmailResponse>>(
    "/auth/account/find-account.php",
    { ...request },
  )
  return data.body
}
