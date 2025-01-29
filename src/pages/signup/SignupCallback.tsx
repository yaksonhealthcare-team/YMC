import { useEffect } from "react"

const SignupCallback = () => {
  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(window.location.search)

    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    if (!tokenVersionId || !encData || !integrityValue) {
      // 팝업인 경우
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "PASS_VERIFICATION_FAILED",
            error: "본인인증에 실패했습니다.",
          },
          "*",
        )
        window.close()
      }
      return
    }

    const handleVerification = async () => {
      try {
        // 팝업인 경우
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
      } catch (error) {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "PASS_VERIFICATION_FAILED",
              error: "본인인증 처리 중 오류가 발생했습니다.",
            },
            "*",
          )
        }
      }
    }

    handleVerification()
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
