import { useOverlay } from "contexts/ModalContext"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"

// 나이스 인증 응답 인터페이스
export interface NiceAuthResponse {
  resultCode: string
  resultMessage: string
  resultCount: string
  body: {
    name: string
    hp: string
    birthdate: string
    sex: string
    nationality_type: string
    token_version_id: string
    di: string
    ci: string
    is_social_exist: {
      E: string
      G: string
      K: string
      N: string
      A: string
    }
  }
}

// 나이스 인증 데이터 처리 훅
export const useNiceAuthCallback = () => {
  const { openModal } = useOverlay()
  const navigate = useNavigate()

  // jsonData에서 나이스 인증 데이터 추출 함수
  const parseNiceAuthData = useCallback(
    (
      jsonData: string | null,
      fallbackPath: string,
    ): NiceAuthResponse["body"] | null => {
      try {
        if (!jsonData) {
          return null
        }

        const decodedData: NiceAuthResponse = JSON.parse(
          decodeURIComponent(jsonData),
        )

        if (decodedData.resultCode !== "00") {
          throw new Error(
            decodedData.resultMessage || "본인인증에 실패했습니다.",
          )
        }

        return decodedData.body
      } catch (error) {
        console.error("본인인증 처리 오류:", error)
        openModal({
          title: "오류",
          message:
            error instanceof Error ? error.message : "본인인증에 실패했습니다.",
          onConfirm: () => {
            navigate(fallbackPath, { replace: true })
          },
        })
        return null
      }
    },
    [navigate, openModal],
  )

  return { parseNiceAuthData }
}
