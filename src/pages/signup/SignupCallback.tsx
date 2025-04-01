import { useOverlay } from "contexts/ModalContext"
import { useSignup } from "contexts/SignupContext"
import { useEffect, useCallback, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Gender } from "utils/gender"
import { useNiceAuthCallback } from "utils/niceAuth"
import { CircularProgress } from "@mui/material"

const providerNames = {
  E: "이메일",
  G: "구글",
  K: "카카오",
  N: "네이버",
  A: "애플",
} as const

const SignupCallback = () => {
  const { setSignupData } = useSignup()
  const [searchParams] = useSearchParams()
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const { parseNiceAuthData } = useNiceAuthCallback()
  const isProcessing = useRef(false)

  const handleVerification = useCallback(
    async (jsonData: string) => {
      if (isProcessing.current) return
      isProcessing.current = true

      try {
        // 공통 유틸리티로 나이스 인증 데이터 파싱
        const userData = parseNiceAuthData(jsonData, "/signup/terms")
        if (!userData) return

        // 소셜 계정 존재 여부 확인
        const isSocialExist = userData.is_social_exist
        const existingProviders = Object.entries(isSocialExist)
          .filter(([_, value]) => value === "Y")
          .map(([key]) => key)

        if (existingProviders.length > 0) {
          const providerText = existingProviders
            .map(
              (provider) =>
                providerNames[provider as keyof typeof providerNames],
            )
            .join(", ")

          openModal({
            title: "알림",
            message: `${providerText}로 이미 가입된 계정입니다.`,
            onConfirm: () => {
              navigate("/login", { replace: true })
            },
          })
          return
        }

        setSignupData((prev) => ({
          ...prev,
          name: userData.name,
          mobileNumber: userData.hp,
          birthDate: userData.birthdate,
          gender: userData.sex as Gender,
          di: userData.di,
          tokenVersionId: userData.token_version_id,
        }))
        navigate("/signup/email")
      } catch (error) {
        console.error("회원가입 처리 오류:", error)
        openModal({
          title: "오류",
          message: "회원가입 정보 처리에 실패했습니다.",
          onConfirm: () => {
            navigate("/signup/terms", { replace: true })
          },
        })
      } finally {
        isProcessing.current = false
      }
    },
    [navigate, openModal, parseNiceAuthData, setSignupData],
  )

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")
    if (jsonData && !isProcessing.current) {
      handleVerification(jsonData)
    }
  }, []) // 빈 의존성 배열로 한 번만 실행

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <CircularProgress color="primary" size={48} />
        <p className="mt-4 text-16px font-medium text-[#212121]">
          본인 인증 정보를 처리 중입니다...
        </p>
      </div>
    </div>
  )
}

export default SignupCallback
