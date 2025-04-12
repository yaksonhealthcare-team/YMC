import LoadingIndicator from "@components/LoadingIndicator"
import { AxiosError } from "axios"
import { useEffect, useRef } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  fetchUser,
  setAccessToken,
  signinWithSocial,
} from "../../apis/auth.api"
import { useAuth } from "../../contexts/AuthContext"
import { useLayout } from "../../contexts/LayoutContext"
import { useOverlay } from "../../contexts/ModalContext"
import { requestForToken } from "../../libs/firebase"
import { saveAccessToken } from "../../queries/clients"

const OAuthCallback = () => {
  const { provider } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const { openModal } = useOverlay()
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
        const jsonData = searchParams.get("jsonData")
        if (!jsonData) {
          return
        }

        const decodedData = decodeURIComponent(jsonData)
        const parsedData = JSON.parse(decodedData)

        const socialData = parsedData.body[0]

        // next_action_type에 따라 분기 처리
        if (socialData.next_action_type === "signup") {
          const socialSignupInfo = {
            provider: getProviderCode(provider),
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
          const fcmToken = await requestForToken()

          const signinResponse = await signinWithSocial({
            SocialAccessToken: socialData.SocialAccessToken,
            thirdPartyType: getProviderCode(provider),
            socialId: socialData.socialId,
            deviceToken: fcmToken,
            deviceType: "web",
            id_token: socialData.id_token,
            SocialRefreshToken: socialData.SocialRefreshToken,
          })

          const accessToken = signinResponse.data.body[0].accessToken
          setAccessToken(accessToken)

          // ReactNativeWebView 환경에서 localStorage에 accessToken 저장
          if (window.ReactNativeWebView) {
            saveAccessToken(accessToken)
          }

          const user = await fetchUser()
          login({ user })
          navigate("/", { replace: true })
          return
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              const socialSignupInfo = {
                provider: getProviderCode(provider),
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
        openModal({
          title: "오류",
          message: "로그인에 실패했습니다.",
          onConfirm: () => {
            navigate("/login", { replace: true })
          },
        })
      }
    }

    handleCallback()
  }, [provider, navigate, login, openModal, searchParams])

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
