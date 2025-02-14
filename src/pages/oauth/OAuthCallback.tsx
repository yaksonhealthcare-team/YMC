import LoadingIndicator from "@components/LoadingIndicator"
import { AxiosError } from "axios"
import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchUser, signinWithSocial } from "../../apis/auth.api"
import { useAuth } from "../../contexts/AuthContext"
import { useLayout } from "../../contexts/LayoutContext"
import { useOverlay } from "../../contexts/ModalContext"

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useOverlay()
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
        if (!jsonData) {
          throw new Error("인증 정보가 없습니다.")
        }

        const decodedData = decodeURIComponent(jsonData)
        const parsedData = JSON.parse(decodedData)

        const socialData = parsedData.body[0]

        // next_action_type에 따라 분기 처리
        if (socialData.next_action_type === "signup") {
          const socialSignupInfo = {
            provider: getProviderCode(provider),
            id: parsedData.Header[0].id,
            ...socialData,
          }

          sessionStorage.setItem(
            "socialSignupInfo",
            JSON.stringify(socialSignupInfo),
          )
          navigate("/signup/terms", { replace: true })
          return
        }

        // 이미 가입된 회원 (next_action_type === "signin")
        try {
          const result = await signinWithSocial({
            socialAccessToken: socialData.SocialAccessToken,
            socialId: socialData.socialId,
            provider: getProviderCode(provider),
          })
          const user = await fetchUser(result.accessToken)
          login({ user, token: result.accessToken })
          navigate("/", { replace: true })
          return
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              const socialSignupInfo = {
                provider: getProviderCode(provider),
                id: parsedData.Header[0].id,
                ...socialData,
              }

              sessionStorage.setItem(
                "socialSignupInfo",
                JSON.stringify(socialSignupInfo),
              )
              navigate("/signup/terms", { replace: true })
              return
            }
          }
          throw error
        }
      } catch (error) {
        showToast("로그인에 실패했습니다.")
        navigate("/login", { replace: true })
      }
    }

    handleCallback()
  }, [provider, navigate, login, showToast])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingIndicator />
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
