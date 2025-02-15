import { useOverlay } from "contexts/ModalContext"

import {
  changePhoneNumberWithDecryptData,
  DecryptRequest,
} from "@apis/decrypt-result.api"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ChangePhoneNumberCallback = () => {
  const { openAlert } = useOverlay()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    const changePhoneNumber = async (request: DecryptRequest) => {
      try {
        return changePhoneNumberWithDecryptData({
          token_version_id: request.token_version_id,
          enc_data: request.enc_data,
          integrity_value: request.integrity_value,
        })
      } catch (error) {
        openAlert({
          title: "오류",
          description: "계정을 찾을 수 없습니다.",
          onClose: () => {
            navigate("/profile/change-phone", { replace: true })
          },
        })
      }
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

        await changePhoneNumber(request)
      } catch (error) {
        openAlert({
          title: "오류",
          description: "계정을 찾을 수 없습니다.",
          onClose: () => {
            navigate("/profile/change-phone", { replace: true })
          },
        })
      }
    }

    handleVerification()
  }, [navigate, openAlert, queryParams])

  return <div>ChangePhoneNumberCallback</div>
}

export default ChangePhoneNumberCallback
