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
      console.log("Code:", code)
      console.log("JsonData:", jsonData)

      try {
        let socialData

        // jsonData가 있는 경우 (애플, 카카오, 네이버)
        if (jsonData) {
          socialData = JSON.parse(decodeURIComponent(jsonData)).body[0]
        }
        // code가 있는 경우 (구글, 카카오, 네이버)
        else if (code) {
          // 각 provider별 토큰 획득
          let socialAccessToken
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

          // 백엔드에 소셜 로그인 시도
          const { data } = await axiosClient.post("/auth/signin/social", {
            thirdPartyType: getProviderCode(provider),
            SocialAccessToken: socialAccessToken,
          })
          socialData = data.body[0]
        } else {
          throw new Error("인증 정보가 없습니다.")
        }

        console.log("Social Data:", socialData)

        // 회원가입이 필요한 경우
        if (!socialData.accessToken) {
          console.log("회원가입 필요")

          const socialSignupInfo = {
            provider: getProviderCode(provider),
            socialId: socialData.socialId,
            email: socialData.email,
            name: socialData.name,
            mobileno: socialData.mobileno,
            birthdate: socialData.birthdate,
            gender: socialData.gender,
          }

          sessionStorage.setItem(
            "socialSignupInfo",
            JSON.stringify(socialSignupInfo),
          )

          navigate("/signup", { replace: true })
          return
        }

        // 로그인 성공
        const { accessToken } = await loginWithSocial({
          provider: getProviderCode(provider),
          accessToken: socialData.socialId,
        })

        const user = await fetchUser(accessToken)
        login({ user, token: accessToken })
        navigate("/", { replace: true })
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
