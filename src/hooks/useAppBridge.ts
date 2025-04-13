import {
  DeviceType,
  fetchUser,
  setAccessToken,
  signinWithSocial,
} from "@apis/auth.api"
import { useAuth } from "contexts/AuthContext"
import { SocialSignupInfo } from "contexts/SignupContext"
import { axiosClient, saveAccessToken } from "queries/clients"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useAppBridge = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data)

      if (data.type) {
        switch (data.type) {
          case "SOCIAL_LOGIN":
            handleSocialLogin(data.data)
            break
          case "FCM_TOKEN":
            handleFcmToken(data.data)
            break
          case "DEVICE_TYPE":
            handleDeviceType(data.data)
            break
        }
      }
    }

    if (localStorage.getItem("osType") === "android") {
      document.addEventListener("message", (e: any) => handleMessage(e))
    } else {
      window.addEventListener("message", (e: any) => handleMessage(e))
    }
  }, [])

  const handleSocialLogin = async (data: any) => {
    // Apple 로그인인 경우 서버 콜백 호출 (provider가 'A' 또는 'apple'인 경우)
    try {
      if (data.provider === "A" || data.provider === "apple") {
        // 콜백 시작 로그
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "CONSOLE_LOG",
            data: "Apple 로그인 콜백 호출 시작",
          }),
        )

        // 서버의 Apple 콜백 API 호출 (환경 변수가 전체 URL이므로 마지막 경로만 추출)
        const appleCallbackUrl = "auth/apple_callback"
        await axiosClient.post(appleCallbackUrl, {
          code: data.authorizationCode,
        })

        return
      }
    } catch (callbackError: any) {
      // 콜백 오류 상세 정보 로그 출력
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `Apple 콜백 처리 중 오류: ${callbackError.message || JSON.stringify(callbackError)}`,
        }),
      )
      throw callbackError
    }

    try {
      // 소셜 로그인 처리 - provider가 문자열인 경우 적절한 코드로 변환
      const providerCode =
        typeof data.provider === "string"
          ? getProviderCode(data.provider)
          : data.provider

      const signinResponse = await signinWithSocial({
        SocialAccessToken: data.accessToken,
        socialId: data.socialId,
        thirdPartyType: providerCode,
        deviceToken: localStorage.getItem("FCM_TOKEN"),
        deviceType: localStorage.getItem("DEVICE_TYPE") as DeviceType,
        id_token: data.idToken,
        SocialRefreshToken: data.refreshToken,
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
    } catch (error: any) {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `소셜 로그인 처리 중 오류: ${JSON.stringify(error)}`,
        }),
      )
      if (error.response.status === 401) {
        window.location.href = "/signup/terms"

        const providerCode =
          typeof data.provider === "string"
            ? getProviderCode(data.provider)
            : data.provider

        const socialSignupInfo: SocialSignupInfo = {
          next_action_type: "signup",
          thirdPartyType: providerCode,
          socialId: data.socialId,
          SocialAccessToken: data.accessToken,
          email: data.email,
          deviceToken: data.deviceToken,
          deviceType: data.deviceType,
          SocialRefreshToken: data.refreshToken,
          id_token: data.idToken,
        }
        sessionStorage.setItem(
          "socialSignupInfo",
          JSON.stringify(socialSignupInfo),
        )

        throw error
      }
    }
  }

  // provider 코드 변환
  const getProviderCode = (provider: string): "K" | "N" | "G" | "A" => {
    switch (provider.toLowerCase()) {
      case "kakao":
        return "K"
      case "naver":
        return "N"
      case "google":
        return "G"
      case "apple":
        return "A"
      default:
        return provider as "K" | "N" | "G" | "A"
    }
  }

  const handleDeviceType = async (data: any) => {
    localStorage.setItem("DEVICE_TYPE", data.deviceType)
  }

  const handleFcmToken = async (data: any) => {
    localStorage.setItem("FCM_TOKEN", data.fcmToken)
  }

  return null
}
