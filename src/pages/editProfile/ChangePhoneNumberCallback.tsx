import { useOverlay } from "contexts/ModalContext"
import { changePhoneNumberWithDecryptData } from "@apis/decrypt-result.api"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useNiceAuthCallback } from "utils/niceAuth"

const ChangePhoneNumberCallback = () => {
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { parseNiceAuthData } = useNiceAuthCallback()

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")

    const changePhoneNumber = async (tokenVersionId: string, di: string) => {
      try {
        return await changePhoneNumberWithDecryptData({
          token_version_id: tokenVersionId,
          di: di,
        })
      } catch (error) {
        openModal({
          title: "오류",
          message: "휴대폰 번호를 변경할 수 없습니다.",
          onConfirm: () => {
            navigate("/profile/change-phone", { replace: true })
          },
        })
      }
    }

    const handleVerification = async () => {
      // 공통 유틸리티로 나이스 인증 데이터 파싱
      const userData = parseNiceAuthData(jsonData, "/profile/change-phone")
      if (!userData) return

      try {
        await changePhoneNumber(userData.token_version_id, userData.di)
        navigate("/profile", { replace: true })
      } catch (error) {
        console.error("휴대폰 번호 변경 오류:", error)
        openModal({
          title: "오류",
          message: "휴대폰 번호를 변경할 수 없습니다.",
          onConfirm: () => {
            navigate("/profile/change-phone", { replace: true })
          },
        })
      }
    }

    handleVerification()
  }, [navigate, openModal, searchParams, parseNiceAuthData])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default ChangePhoneNumberCallback
