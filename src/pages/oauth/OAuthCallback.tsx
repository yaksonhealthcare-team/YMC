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
        console.log("🚀 URL Search Params:", Object.fromEntries(searchParams))

        const jsonData = searchParams.get("jsonData")
        console.log("🚀 Raw jsonData:", jsonData)

        // 소셜 로그인 응답 처리
        if (jsonData) {
          const decodedData = decodeURIComponent(jsonData)
          console.log("🚀 Decoded jsonData:", decodedData)

          const parsedData = JSON.parse(decodedData)
          console.log("🚀 Parsed Response:", {
            resultCode: parsedData.resultCode,
            resultMessage: parsedData.resultMessage,
            resultCount: parsedData.resultCount,
            Header: parsedData.Header,
            body: parsedData.body,
          })

          const socialData = parsedData.body[0]
          console.log("🚀 Social Data:", {
            accessToken: socialData.accessToken,
            socialId: socialData.socialId,
            email: socialData.email,
            name: socialData.name,
            mobileno: socialData.mobileno,
            birthdate: socialData.birthdate,
            gender: socialData.gender,
          })

          // 이미 가입된 회원 (accessToken 있음)
          if (socialData.accessToken) {
            console.log("✅ 이미 가입된 회원 - 자동 로그인")
            const user = await fetchUser(socialData.accessToken)
            login({ user, token: socialData.accessToken })
            navigate("/", { replace: true })
            return
          }

          // 미가입 회원 (socialId만 있음)
          if (socialData.socialId) {
            console.log("✅ 미가입 회원 - 회원가입 페이지로 이동")
            const socialSignupInfo = {
              provider: getProviderCode(provider),
              id: parsedData.Header[0].id, // Header에서 id 값 가져오기
              ...socialData, // 모든 응답 데이터 포함
            }
            console.log("🚀 Social Signup Info:", socialSignupInfo)

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
        console.error("❌ Error:", error)
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
