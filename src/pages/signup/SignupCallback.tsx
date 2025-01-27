import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchDecryptResult } from "../../apis/auth.api"

interface DecryptRequest {
  token_version_id: string
  enc_data: string
  integrity_value: string
}

const SignupCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(window.location.search)
    const returnPath = queryParams.get("return_path")

    if (!returnPath) {
      // 리다이렉션 경로가 없는 경우 에러 처리
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "PASS_VERIFICATION_FAILED",
            error: "리다이렉션 경로가 지정되지 않았습니다.",
          },
          "*",
        )
        window.close()
      } else {
        navigate("/", {
          state: { error: "리다이렉션 경로가 지정되지 않았습니다." },
          replace: true,
        })
      }
      return
    }

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
      } else {
        // 일반 페이지인 경우
        navigate("/", {
          state: { error: "본인인증에 실패했습니다." },
          replace: true,
        })
      }
      return
    }

    const handleVerification = async () => {
      try {
        const request: DecryptRequest = {
          token_version_id: tokenVersionId,
          enc_data: encData,
          integrity_value: integrityValue,
        }

        const response = await fetchDecryptResult(request)
        const verificationData = {
          type: "PASS_VERIFICATION_DATA",
          data: {
            ...request,
            userData: response.body,
          },
        }

        // 팝업인 경우
        if (window.opener) {
          window.opener.postMessage(verificationData, "*")
          window.close()
        } else {
          // 일반 페이지인 경우
          navigate(returnPath, {
            state: { verificationData },
            replace: true,
          })
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
          window.close()
        } else {
          navigate("/", {
            state: { error: "본인인증 처리 중 오류가 발생했습니다." },
            replace: true,
          })
        }
      }
    }

    handleVerification()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default SignupCallback
