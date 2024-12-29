import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useOverlay } from "../../contexts/ModalContext"
import { useLayout } from "../../contexts/LayoutContext"
import { fetchUser } from "../../apis/auth.api"

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
        console.log("🚀 소셜 로그인 콜백 시작:", {
          provider,
          searchParams: Object.fromEntries(searchParams),
        })

        const jsonData = searchParams.get("jsonData")
        if (!jsonData) {
          console.error("❌ jsonData가 없음")
          throw new Error("인증 정보가 없습니다.")
        }

        const decodedData = decodeURIComponent(jsonData)
        const parsedData = JSON.parse(decodedData)

        console.log("📦 소셜 로그인 응답:", {
          resultCode: parsedData.resultCode,
          resultMessage: parsedData.resultMessage,
          header: parsedData.Header[0],
          body: parsedData.body[0],
        })

        const socialData = parsedData.body[0]

        // 이미 가입된 회원 (accessToken 있음)
        if (socialData.accessToken) {
          console.log("✅ 이미 가입된 회원 - 로그인 시도")
          try {
            const user = await fetchUser(socialData.accessToken)
            console.log("✅ 유저 정보 조회 성공:", user)
            login({ user, token: socialData.accessToken })
            navigate("/", { replace: true })
            return
          } catch (error) {
            console.error("❌ 유저 정보 조회 실패:", error)
            throw error
          }
        }

        // 미가입 회원 (socialId만 있음)
        if (socialData.socialId) {
          console.log("ℹ️ 미가입 회원 - 회원가입 페이지로 이동")
          const socialSignupInfo = {
            provider: getProviderCode(provider),
            id: parsedData.Header[0].id,
            ...socialData,
          }
          console.log("📝 저장할 회원가입 정보:", socialSignupInfo)

          sessionStorage.setItem(
            "socialSignupInfo",
            JSON.stringify(socialSignupInfo),
          )
          navigate("/signup", { replace: true })
          return
        }

        throw new Error("유효하지 않은 응답 데이터")
      } catch (error) {
        console.error("❌ 소셜 로그인 처리 실패:", error)
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
