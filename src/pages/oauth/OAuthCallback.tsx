import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { loginWithSocial, fetchUser } from "../../apis/auth.api"
import { getKakaoToken } from "../../libs/kakao"
import { getNaverToken } from "../../libs/naver"

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get("code")

      if (!code) {
        navigate("/login")
        return
      }

      try {
        let socialAccessToken = ""

        // 소셜 플랫폼별 토큰 획득
        switch (provider) {
          case "kakao":
            socialAccessToken = await getKakaoToken(code)
            break
          case "naver":
            const state = searchParams.get("state")
            if (!state) {
              throw new Error("State parameter is missing")
            }
            socialAccessToken = await getNaverToken(code, state)
            break
          // 다른 provider 추가 예정
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

  return <div>로그인 처리중...</div>
}

// provider 코드 변환
const getProviderCode = (provider?: string): "K" | "N" | "A" => {
  switch (provider) {
    case "kakao":
      return "K"
    case "naver":
      return "N"
    case "apple":
      return "A"
    default:
      throw new Error("Invalid provider")
  }
}

export default OAuthCallback
