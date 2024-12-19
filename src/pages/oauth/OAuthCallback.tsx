import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { loginWithSocial, fetchUser } from "../../apis/auth.api"
import { getKakaoToken } from "../../libs/kakao"
import { getNaverToken } from "../../libs/naver"
import { getGoogleToken } from "../../libs/google"
import { getAppleToken } from "../../libs/apple"
import { useOverlay } from "../../contexts/ModalContext"
import { SocialSignupInfo } from "../../contexts/SignupContext"
import { axiosClient } from "../../queries/clients"
import { useLayout } from "../../contexts/LayoutContext"

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showAlert } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const isProcessing = useRef(false)

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing.current) return
      isProcessing.current = true

      try {
        const searchParams = new URLSearchParams(window.location.search)
        const jsonData = searchParams.get("jsonData")

        // 소셜 로그인 응답 처리
        if (jsonData) {
          const socialData = JSON.parse(decodeURIComponent(jsonData)).body[0]

          // 이미 가입된 회원 (accessToken 있음)
          if (socialData.accessToken) {
            const user = await fetchUser(socialData.accessToken)
            login({ user, token: socialData.accessToken })
            navigate("/", { replace: true })
            return
          }

          // 미가입 회원 (socialId만 있음)
          if (socialData.socialId) {
            const socialSignupInfo = {
              provider: getProviderCode(provider),
              socialId: socialData.socialId,
              email: socialData.email || "",
              name: socialData.name || "",
              mobileno: socialData.mobileno || "",
              birthdate: socialData.birthdate || "",
              gender: socialData.gender || "",
            }

            sessionStorage.setItem(
              "socialSignupInfo",
              JSON.stringify(socialSignupInfo),
            )
            navigate("/signup", { replace: true })
            return
          }
        }

        throw new Error("인증 정보가 없습니다.")
      } catch (error) {
        showAlert("로그인에 실패했습니다.")
        navigate("/login", { replace: true })
      }
    }

    handleCallback()
  }, [provider, navigate, login, showAlert])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600">로그인 처리중...</p>
    </div>
  )
}

// provider 코드 변환
const getProviderCode = (provider?: string): "K" | "N" | "G" | "A" => {
  switch (provider) {
    case "kakao":
      return "K"
    case "naver":
      return "N"
    case "google":
      return "G"
    case "apple":
      return "A"
    default:
      throw new Error("Invalid provider")
  }
}

export default OAuthCallback
