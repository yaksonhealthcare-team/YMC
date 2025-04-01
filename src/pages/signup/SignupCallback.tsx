import { useOverlay } from "contexts/ModalContext"
import { useSignup } from "contexts/SignupContext"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Gender } from "utils/gender"
import { useNiceAuthCallback } from "utils/niceAuth"
import { CircularProgress } from "@mui/material"

const SignupCallback = () => {
  const { setSignupData } = useSignup()
  const [searchParams] = useSearchParams()
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const { parseNiceAuthData } = useNiceAuthCallback()

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")

    const handleVerification = async () => {
      // 공통 유틸리티로 나이스 인증 데이터 파싱
      const userData = parseNiceAuthData(jsonData, "/signup/terms")
      if (!userData) return

      try {
        // 소셜 계정 존재 여부 확인
        const isSocialExist = userData.is_social_exist
        const existingProviders = Object.entries(isSocialExist)
          .filter(([_, value]) => value === "Y")
          .map(([key]) => key)

        if (existingProviders.length > 0) {
          const providerNames = {
            E: "이메일",
            G: "구글",
            K: "카카오",
            N: "네이버",
            A: "애플",
          }

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
      }
    }

    handleVerification()
  }, [searchParams, navigate, openModal, setSignupData, parseNiceAuthData])

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
