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

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showAlert } = useOverlay()
  const isProcessing = useRef(false)

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing.current) {
        return
      }
      isProcessing.current = true

      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get("code")
      const jsonData = searchParams.get("jsonData")

      console.log("Provider:", provider)
      console.log("JsonData:", jsonData)

      try {
        let socialAccessToken = ""

        // 애플 로그인의 경우 jsonData 파싱
        if (provider === "apple" && jsonData) {
          const data = JSON.parse(decodeURIComponent(jsonData))
          console.log("Parsed Apple Data:", data)

          const socialInfo = data.body[0]
          console.log("Social Info:", socialInfo)

          // 회원가입이 필요한 경우
          if (!socialInfo.accessToken) {
            console.log("회원가입 필요")

            // 소셜 정보 저장
            const socialSignupInfo: SocialSignupInfo = {
              provider: "A",
              socialId: socialInfo.socialId,
              email: socialInfo.email,
            }
            sessionStorage.setItem(
              "socialSignupInfo",
              JSON.stringify(socialSignupInfo),
            )

            navigate("/signup", { replace: true })
            return
          }

          socialAccessToken = socialInfo.accessToken
        } else if (code) {
          // 다른 소셜 로그인 처리
          switch (provider) {
            case "kakao":
              socialAccessToken = await getKakaoToken(code)
              break
            case "naver":
              socialAccessToken = await getNaverToken(code)
              break
            case "google":
              socialAccessToken = await getGoogleToken(code)
              break
            default:
              throw new Error("Invalid provider")
          }
        } else if (!code && !jsonData) {
          throw new Error("인증 정보가 없습니다.")
        }

        if (socialAccessToken) {
          // 서버 로그인
          const { accessToken } = await loginWithSocial({
            provider: getProviderCode(provider),
            accessToken: socialAccessToken,
          })

          const user = await fetchUser(accessToken)
          login({ user, token: accessToken })
          navigate("/")
        }
      } catch (error) {
        console.error("Error in callback:", error)
        if (error instanceof Error) {
          showAlert(error.message)
        } else {
          showAlert("로그인에 실패했습니다.")
        }
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
