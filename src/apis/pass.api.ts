import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"

export interface EncryptData {
  m: string
  token_version_id: string
  enc_data: string
  integrity_value: string
}

export const fetchEncryptDataForNice = async () => {
  // TODO: 프로덕션 배포 시 return_url 도메인 수정 필요
  // 현재: 개발환경(localhost) 및 개발서버에서 사용
  const origin = window.location.origin
  const return_url = `${origin}/signup/callback`

  const { data } = await axiosClient.post<HTTPResponse<EncryptData[]>>(
    "/auth/crypto/token.php",
    { return_url },
  )

  return data
}
