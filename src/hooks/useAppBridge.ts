import {
  DeviceType,
  fetchUser,
  setAccessToken,
  signinWithSocial,
} from "@apis/auth.api"
import { LOCAL_STORAGE_KEYS } from "@constants/storage"
import axios, { AxiosError } from "axios"
import { useAuth } from "contexts/AuthContext"
import { SocialSignupInfo } from "contexts/SignupContext"
import { axiosClient, saveAccessToken } from "queries/clients"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SocialLoginRequest } from "types/appBridge"

export const useAppBridge = () => {
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: event.data,
        }),
      )
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

    const androidMessageHandler = (event: Event) => {
      // MessageEvent의 속성(data)에 접근하기 위해 타입 단언 사용
      handleMessage(event as MessageEvent)
    }

    if (window.osType === "android") {
      // document의 message 이벤트 리스너는 일반 Event 타입을 받음
      document.addEventListener("message", androidMessageHandler)
    } else {
      // window의 message 이벤트 리스너는 MessageEvent 타입을 사용
      window.addEventListener("message", handleMessage)
    }
  }, [])

  const handleSocialLogin = async (data: SocialLoginRequest) => {
    // Apple 로그인인 경우 서버 콜백 호출 (provider가 'A' 또는 'apple'인 경우)
    try {
      if (data.provider === "A") {
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

      const idToken: string | undefined = data.idToken

      const signinResponse = await signinWithSocial({
        SocialAccessToken: data.accessToken,
        socialId: data.socialId,
        thirdPartyType: providerCode,
        deviceToken:
          data.fcmToken ?? localStorage.getItem(LOCAL_STORAGE_KEYS.FCM_TOKEN),
        deviceType: data.deviceType,
        id_token: idToken,
        SocialRefreshToken: data.refreshToken,
      })

      if (signinResponse.data.body.length === 0) {
        throw new AxiosError("로그인에 실패했습니다.", "401")
      }

      const accessToken = signinResponse.data.body[0].accessToken

      if (!accessToken) {
        throw new AxiosError("로그인에 실패했습니다.", "401")
      }

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
          socialId: data.socialId,
          SocialAccessToken: data.accessToken,
          email: data.email,
          deviceToken: data.fcmToken,
          deviceType: data.deviceType as DeviceType,
          SocialRefreshToken: data.refreshToken,
          id_token: data.idToken,
        }
        sessionStorage.setItem(
          "socialSignupInfo",
          JSON.stringify(socialSignupInfo),
        )

        throw error
      }
      // 401 외 다른 에러 처리 (필요시 추가)
      alert("소셜 로그인 처리 중 오류가 발생했습니다.")
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.FCM_TOKEN, data.fcmToken as string)
  }

  // 네이티브에서 받은 액세스 토큰을 처리하는 함수
  const handleSetAccessToken = async (data: any) => {
    if (data.accessToken) {
      // localStorage에 액세스 토큰 저장
      saveAccessToken(data.accessToken)

      // axios 헤더에 액세스 토큰 설정
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
        logout()
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

    logout()
  }

  return null
}
