import { useEffect } from "react"

const SignupCallback = () => {
  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(window.location.search)

    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    if (!tokenVersionId || !encData || !integrityValue) {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "PASS_VERIFICATION_FAILED",
            error: "본인인증에 실패했습니다.",
          },
          "*",
        )
      }
      window.close()
      return
    }

    // 본인인증 결과 데이터를 부모 창으로 전달
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "PASS_VERIFICATION_DATA",
          data: {
            token_version_id: tokenVersionId,
            enc_data: encData,
            integrity_value: integrityValue,
          },
        },
        "*",
      )
    }
    window.close()
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
