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
import axios from "axios"

export const useAppBridge = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailLogin = async (data: Record<string, unknown>) => {
    const loginResponse = await loginWithEmail({
      username: data.username as string,
      password: data.password as string,
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
            setAccessToken(data.data)
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
      // document의 message 이벤트 리스너는 일반 Event 타입을 받음
      const androidMessageHandler = (event: Event) => {
        // MessageEvent의 속성(data)에 접근하기 위해 타입 단언 사용
        handleMessage(event as MessageEvent)
      }
      document.addEventListener("message", androidMessageHandler)
      return () => {
        document.removeEventListener("message", androidMessageHandler)
      }
    } else {
      // window의 message 이벤트 리스너는 MessageEvent 타입을 사용
      window.addEventListener("message", handleMessage)
      return () => {
        window.removeEventListener("message", handleMessage)
      }
    }
  }, [])

  const handleSocialLogin = async (data: Record<string, unknown>) => {
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
          code: data.authorizationCode as string,
          id_token: data.idToken as string,
          state: "state",
        })
        return
      }
    } catch (callbackError: unknown) {
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
          : (data.provider as "K" | "N" | "G" | "A")

      const signinResponse = await signinWithSocial({
        SocialAccessToken: data.accessToken as string,
        socialId: data.socialId as string,
        thirdPartyType: providerCode,
        deviceToken: localStorage.getItem("FCM_TOKEN"),
        deviceType: localStorage.getItem("DEVICE_TYPE") as DeviceType,
        id_token: data.idToken as string | undefined,
        SocialRefreshToken: data.refreshToken as string | undefined,
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
    } catch (error: unknown) {
      // Axios 에러인지 확인하여 response 상태 코드 접근
      let status = 500 // 기본값
      if (axios.isAxiosError(error)) {
        status = error.response?.status ?? 500
      }

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `소셜 로그인 처리 중 오류: ${JSON.stringify(error)}`,
        }),
      )
      if (status === 401) {
        window.location.href = "/signup/terms"

        const providerCode =
          typeof data.provider === "string"
            ? getProviderCode(data.provider)
            : (data.provider as "K" | "N" | "G" | "A")

        const socialSignupInfo: SocialSignupInfo = {
          next_action_type: "signup",
          thirdPartyType: providerCode,
          socialId: data.socialId as string,
          SocialAccessToken: data.accessToken as string,
          email: (data.email as string | undefined) ?? "",
          deviceToken: (data.deviceToken as string | undefined) ?? "",
          deviceType: (data.deviceType as DeviceType | undefined) ?? "ETC",
          SocialRefreshToken: (data.refreshToken as string | undefined) ?? "",
          id_token: (data.idToken as string | undefined) ?? "",
        }
        sessionStorage.setItem(
          "socialSignupInfo",
          JSON.stringify(socialSignupInfo),
        )

        throw error
      }
      // 401 외 다른 에러 처리 (필요시 추가)
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
        // 기본값 또는 에러 처리 로직 추가 가능
        // throw new Error(`Unknown provider: ${provider}`)
        return provider as "K" | "N" | "G" | "A" // 임시 타입 단언
    }
  }

  const handleDeviceType = async (data: Record<string, unknown>) => {
    localStorage.setItem("DEVICE_TYPE", data.deviceType as string)
  }

  const handleFcmToken = async (data: Record<string, unknown>) => {
    localStorage.setItem("FCM_TOKEN", data.fcmToken as string)
  }

  return null
}
