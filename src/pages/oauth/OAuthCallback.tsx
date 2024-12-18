import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { loginWithSocial, fetchUser } from "../../apis/auth.api"
import { getKakaoToken } from "../../libs/kakao"
import { getNaverToken } from "../../libs/naver"
import { getGoogleToken } from "../../libs/google"

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get("code")
      const id_token = searchParams.get("id_token")
      let socialAccessToken = ""

      if (!code) {
        navigate("/login")
        return
      }

      try {
        // 소셜 플랫폼별 토큰 획득
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
          case "apple":
            if (!id_token) {
              throw new Error("ID token is missing")
            }
            socialAccessToken = id_token
            break
        }

        // 서버 로그인
        const { accessToken } = await loginWithSocial({
          provider: getProviderCode(provider), // kakao -> K
          accessToken: socialAccessToken,
        })

        const user = await fetchUser(accessToken)
        login({ user, token: accessToken })

        navigate("/")
      } catch (error: any) {
        if (error.response?.data?.code === "28") {
          // 회원가입 필요 - 기존 회원가입 약관 페이지로 이동
          navigate("/signup", {
            state: {
              social: {
                provider: getProviderCode(provider),
                accessToken: socialAccessToken,
              },
            },
          })
        } else {
          console.error("Social login failed:", error)
          navigate("/login")
        }
      }
    }

    handleCallback()
  }, [])

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
