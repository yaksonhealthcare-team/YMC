import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"

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
}

export const fetchDecryptResult = async (request: DecryptRequest) => {
  const { data } = await axiosClient.post<HTTPResponse<DecryptResponse>>(
    "/auth/decrypt/result.php",
    { ...request },
  )

  return data
}
