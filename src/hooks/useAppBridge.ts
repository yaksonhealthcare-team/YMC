import {
  DeviceType,
  fetchUser,
  loginWithEmail,
  setAccessToken,
  signinWithSocial,
} from "@apis/auth.api"
import { useAuth } from "contexts/AuthContext"
import { SocialSignupInfo } from "contexts/SignupContext"
import { axiosClient, saveAccessToken } from "queries/clients"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTokenStore } from "../store/tokenStore"

export const useAppBridge = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailLogin = async (data: any) => {
    const loginResponse = await loginWithEmail({
      username: data.username,
      password: data.password,
      deviceToken: localStorage.getItem("FCM_TOKEN"),
      deviceType: localStorage.getItem("DEVICE_TYPE") as DeviceType,
    })

    const accessToken = loginResponse.accessToken

    // ReactNativeWebView로 accessToken 전달
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "LOGIN_SUCCESS",
          data: {
            accessToken: accessToken,
          },
        }),
      )
    }

    const user = await fetchUser()
    login({ user })
    if (location.pathname.includes("/login")) {
      navigate("/", { replace: true })
    }
  }

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
          case "EMAIL_LOGIN":
            handleEmailLogin(data.data)
            break
          case "SET_ACCESS_TOKEN":
            handleSetAccessToken(data.data)
            break
        }
      }

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "LOADING_END",
        }),
      )
    }

    if (!window.ReactNativeWebView) {
      return
    }

    if (window.osType === "android") {
      document.addEventListener("message", (e: any) => handleMessage(e))
      return () => {
        document.removeEventListener("message", (e: any) => handleMessage(e))
      }
    } else {
      window.addEventListener("message", (e: any) => handleMessage(e))
      return () => {
        window.removeEventListener("message", (e: any) => handleMessage(e))
      }
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
          id_token: data.idToken,
          state: "state",
        })
        return
      }
    } catch (callbackError: any) {
      // 콜백 오류 상세 정보 로그 출력
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `Apple 콜백 처리 중 오류: ${JSON.stringify(callbackError)}`,
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

        // ReactNativeWebView로 accessToken 전달
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "LOGIN_SUCCESS",
            data: {
              accessToken: accessToken,
            },
          }),
        )
      }

      const user = await fetchUser()
      login({ user })
      if (location.pathname === "/login") {
        navigate("/", { replace: true })
      }
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

  // 네이티브에서 받은 액세스 토큰을 처리하는 함수
  const handleSetAccessToken = async (data: any) => {
    if (data.accessToken) {
      // Zustand 스토어 상태 가져오기
      const tokenStore = useTokenStore.getState()

      // 액세스 토큰 설정 (스토어를 통해)
      tokenStore.setAccessToken(data.accessToken)

      // 액세스 토큰 설정 (API 클라이언트용)
      setAccessToken(data.accessToken)

      try {
        // 토큰으로 사용자 정보 가져오기
        const user = await fetchUser()
        login({ user })

        // 로그인 페이지에 있다면 홈으로 리다이렉트
        if (location.pathname.includes("/login")) {
          navigate("/", { replace: true })
        }

        // 토큰 설정 성공 응답
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "SET_ACCESS_TOKEN_SUCCESS",
          }),
        )
      } catch (error) {
        // 오류 발생 시 로그
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "SET_ACCESS_TOKEN_ERROR",
            data: {
              message: "토큰으로 사용자 정보를 가져오는데 실패했습니다",
              error: JSON.stringify(error),
            },
          }),
        )
      }
      return
    }

    login({ user: null })
  }

  return null
}
