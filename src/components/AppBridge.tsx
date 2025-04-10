import { fetchUser, signinWithSocial, UserNotFoundError } from "@apis/auth.api"
import { useAuth } from "contexts/AuthContext"
import { SocialSignupInfo } from "contexts/SignupContext"
import { axiosClient } from "queries/clients"
import React, { useEffect } from "react"

const AppBridge = ({ children }: { children?: React.ReactNode }) => {
  if (!window.ReactNativeWebView) {
    return <>{children}</>
  }

  const { login } = useAuth()

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.onMessage = (data: string) => {
        // TODO: 개발 환경일 때만 로그 찍도록
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "CONSOLE_LOG",
            data: `Received message: ${data}`,
          }),
        )

        let result
        try {
          result = JSON.parse(data)
        } catch {
          result = data
        }

        if (result.type) {
          switch (result.type) {
            case "SOCIAL_LOGIN":
              handleSocialLogin(result.data)
              break
            case "FCM_TOKEN":
              handleFcmToken(result.data)
              break
            case "DEVICE_TYPE":
              handleDeviceType(result.data)
              break
          }
        }
      }
    }
  }, [])

  const handleSocialLogin = async (data: any) => {
    try {
      // Apple 로그인인 경우 서버 콜백 호출 (provider가 'A' 또는 'apple'인 경우)
      if (data.provider === "A" || data.provider === "apple") {
        try {
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
        } catch (callbackError: any) {
          // 콜백 오류 상세 정보 로그 출력
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "CONSOLE_LOG",
              data: `Apple 콜백 처리 중 오류: ${callbackError.message || JSON.stringify(callbackError)}`,
            }),
          )
          // 콜백 오류가 발생해도 계속 진행 (서버에서는 이미 처리했을 수 있음)
        }
      }

      // 소셜 로그인 처리 - provider가 문자열인 경우 적절한 코드로 변환
      const providerCode =
        typeof data.provider === "string"
          ? getProviderCode(data.provider)
          : data.provider

      await signinWithSocial({
        SocialAccessToken: data.accessToken,
        socialId: data.socialId,
        thirdPartyType: providerCode,
        deviceToken: data.deviceToken,
        deviceType: data.deviceType,
        id_token: data.idToken,
        SocialRefreshToken: data.refreshToken,
      })
      const user = await fetchUser()
      login({ user })
      window.location.href = "/"
      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        // provider가 문자열인 경우 적절한 코드로 변환
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

        // Apple 로그인인 경우 회원가입 페이지로 이동하기 전 로그
        if (data.provider === "A" || data.provider === "apple") {
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "CONSOLE_LOG",
              data: "Apple 회원가입 진행 중...",
            }),
          )
        }

        window.location.href = "/signup/terms"
        return
      }
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `Error: ${JSON.stringify(error)}`,
        }),
      )
      throw error
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

  return <>{children}</>
}

export default AppBridge
