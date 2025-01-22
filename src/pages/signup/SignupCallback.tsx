import { DecryptRequest, fetchDecryptResult } from "apis/decrypt-result.api"
import { useEffect } from "react"

const SignupCallback = () => {
  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(window.location.search)

    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    if (!tokenVersionId || !encData || !integrityValue) {
      return
    }

    const request: DecryptRequest = {
      token_version_id: tokenVersionId,
      enc_data: encData,
      integrity_value: integrityValue,
    }

    fetchDecryptResult(request).then((res) => {
      console.log(res)
      // TODO: 본인 인증 실패, 성공 처리 필요
    })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default SignupCallback
