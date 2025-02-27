import {
  DecryptRequest,
  findEmailWithDecryptData,
} from "@apis/decrypt-result.api"
import { AxiosError } from "axios"
import { useOverlay } from "contexts/ModalContext"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const FindAccountCallback = () => {
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()
  const queryParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    const fetchEmail = async (request: DecryptRequest) => {
      return findEmailWithDecryptData({
        token_version_id: request.token_version_id,
        enc_data: request.enc_data,
        integrity_value: request.integrity_value,
      })
    }

    const handleVerification = async () => {
      try {
        if (!tokenVersionId || !encData || !integrityValue) {
          throw new Error("본인인증 정보가 없습니다.")
        }

        const request: DecryptRequest = {
          token_version_id: tokenVersionId,
          enc_data: encData,
          integrity_value: integrityValue,
        }

        if (tab === "find-email") {
          const loginInfo = await fetchEmail(request)

          sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo))
          navigate(`/find-account/${tab}`, {
            replace: true,
          })
        } else if (tab === "reset-password") {
          navigate(`/find-account/reset-password`, {
            replace: true,
            state: {
              verifiedData: {
                token_version_id: tokenVersionId,
                enc_data: encData,
                integrity_value: integrityValue,
              },
            },
          })
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          openModal({
            title: "오류",
            message:
              error.response?.data?.resultMessage || "본인인증에 실패했습니다.",
            onConfirm: () => {
              navigate("/find-account", { replace: true })
            },
          })
          return
        }
        openModal({
          title: "오류",
          message: "본인인증에 실패했습니다.",
          onConfirm: () => {
            navigate("/find-account", { replace: true })
          },
        })
      }
    }

    handleVerification()
  }, [navigate, openModal, tab, queryParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default FindAccountCallback
