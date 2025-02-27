import { useOverlay } from "contexts/ModalContext"
import { useSignup } from "contexts/SignupContext"
import { useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useNiceAuthCallback } from "utils/niceAuth"

const SignupCallback = () => {
  const { setSignupData } = useSignup()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { openModal } = useOverlay()
  const socialInfo = location.state?.social
  const navigate = useNavigate()
  const { parseNiceAuthData } = useNiceAuthCallback()

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")

    const handleVerification = async () => {
      // 공통 유틸리티로 나이스 인증 데이터 파싱
      const userData = parseNiceAuthData(jsonData, "/signup/terms")
      if (!userData) return

      try {
        console.log(userData)
        setSignupData((prev) => ({
          ...prev,
          name: userData.name,
          mobileNumber: userData.hp,
          birthDate: userData.birthdate,
          gender: userData.sex === "M" ? "male" : "female",
          di: userData.di,
          tokenVersionId: userData.token_version_id,
          ...(socialInfo && {
            social: {
              provider: socialInfo.provider,
              accessToken: socialInfo.accessToken,
            },
          }),
        }))
        navigate(socialInfo ? "/signup/profile" : "/signup/email")
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
  }, [
    searchParams,
    navigate,
    openModal,
    socialInfo,
    setSignupData,
    parseNiceAuthData,
  ])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default SignupCallback
