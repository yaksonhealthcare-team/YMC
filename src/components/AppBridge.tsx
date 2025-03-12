import { fetchUser, signinWithSocial, UserNotFoundError } from "@apis/auth.api"
import { useAuth } from "contexts/AuthContext"
import React, { useEffect } from "react"
import { SocialSignupInfo } from "contexts/SignupContext"
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
            case "LOGOUT":
              handleLogout()
              break
          }
        }
      }
    }
  }, [])

  const handleSocialLogin = async (data: any) => {
    try {
      const { accessToken } = await signinWithSocial({
        SocialAccessToken: data.accessToken,
        socialId: data.socialId,
        thirdPartyType: data.provider,
        deviceToken: data.deviceToken,
        deviceType: data.deviceType,
        id_token: data.idToken,
        SocialRefreshToken: data.refreshToken,
      })
      const user = await fetchUser(accessToken)
      login({ user, token: accessToken })
      window.location.href = "/"
      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        const socialSignupInfo: SocialSignupInfo = {
          next_action_type: "signup",
          thirdPartyType: data.provider,
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

  const handleLogout = () => {
    console.log("로그아웃 처리")
    // TODO: 로그아웃 로직 구현
  }

  return <>{children}</>
}

export default AppBridge
