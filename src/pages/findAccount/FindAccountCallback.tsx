import { findEmailWithDecryptData } from "@apis/decrypt-result.api"
import { useOverlay } from "contexts/ModalContext"
import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useNiceAuthCallback } from "utils/niceAuth"

const FindAccountCallback = () => {
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()
  const [searchParams] = useSearchParams()
  const { parseNiceAuthData } = useNiceAuthCallback()

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")

    const handleVerification = async () => {
      // 공통 유틸리티로 나이스 인증 데이터 파싱
      const userData = parseNiceAuthData(jsonData, "/find-account")
      if (!userData) return

      try {
        if (tab === "find-email") {
          const loginInfo = await findEmailWithDecryptData({
            token_version_id: userData.token_version_id,
            di: userData.di,
          })

          if (!loginInfo) {
            throw new Error("계정을 찾을 수 없습니다.")
          }

          sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo))
          navigate(`/find-account/${tab}`, {
            replace: true,
          })
        } else if (tab === "reset-password") {
          navigate(`/find-account/reset-password`, {
            replace: true,
            state: {
              verifiedData: {
                token_version_id: userData.token_version_id,
                di: userData.di,
              },
            },
          })
        }
      } catch (error) {
        console.error("계정 찾기 오류:", error)
        openModal({
          title: "오류",
          message: "계정을 찾을 수 없습니다.",
          onConfirm: () => {
            navigate("/find-account", { replace: true })
          },
        })
      }
    }

    if (jsonData) {
      handleVerification()
    }
  }, [navigate, openModal, tab, searchParams, parseNiceAuthData])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default FindAccountCallback
