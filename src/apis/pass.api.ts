import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"

export interface EncryptData {
  m: string
  token_version_id: string
  enc_data: string
  integrity_value: string
}

export const fetchEncryptDataForNice = async () => {
  const { data } = await axiosClient.post<HTTPResponse<EncryptData[]>>(
    "/auth/crypto/token.php",
  )

  return data
}
