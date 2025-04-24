import { AxiosError } from "axios"
import { requestForToken } from "libs/firebase"
import { useNavigate } from "react-router-dom"
import {
  fetchUser,
  loginWithEmail,
  setAccessToken,
  signinWithSocial,
  signup,
  signupWithSocial,
} from "../apis/auth.api"
import { useAuth } from "../contexts/AuthContext"
import { useOverlay } from "../contexts/ModalContext"
import { useSignup } from "../contexts/SignupContext"
import { saveAccessToken } from "../queries/clients"

type SocialProvider = "N" | "K" | "G" | "A"

export interface SocialSignupInfo {
  email?: string
  socialId: string
  di: string
  thirdPartyType: SocialProvider
  token_version_id: string
  id_token?: string
  SocialRefreshToken?: string
  deviceToken?: string
  deviceType?: "android" | "ios" | "web"
  next_action_type?: "signup"
}

export const useProfileSetupSubmit = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useOverlay()
  const { signupData, cleanup } = useSignup()

  const handleSocialSignup = async (socialInfo: SocialSignupInfo) => {
    try {
      const response = await signupWithSocial({
        thirdPartyType: socialInfo.thirdPartyType,
        userInfo: {
          ...socialInfo,
          name: signupData.name,
          email: signupData.email,
          mobileno: signupData.mobileNumber,
          birthdate: signupData.birthDate,
          gender: signupData.gender,
          di: signupData.di,
          token_version_id: signupData.tokenVersionId,
          post: signupData.postCode,
          addr1: signupData.address1,
          addr2: signupData.address2 || "",
          marketing_yn: socialInfo.SocialRefreshToken ? "Y" : "N",
          brand_code: signupData.brandCodes || [],
          profileUrl: signupData.profileUrl,
          profileURL: signupData.profileUrl,
        },
      })

      if (!response?.body?.length || !response.body[0]?.accessToken) {
        throw new Error(
          response?.resultMessage ?? "회원가입 응답이 올바르지 않습니다",
        )
      }

      const signinResponse = await signinWithSocial({
        thirdPartyType: socialInfo.thirdPartyType,
        SocialAccessToken: response.body[0].accessToken,
        socialId: socialInfo.socialId,
        id_token: socialInfo.id_token,
        SocialRefreshToken: socialInfo.SocialRefreshToken,
        deviceToken: socialInfo.deviceToken ?? (await requestForToken()),
        deviceType: socialInfo.deviceType ?? window.osType ?? "web",
      })

      const accessToken = signinResponse.data.body[0].accessToken

      if (!accessToken) {
        throw new Error("로그인에 실패했습니다.")
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
      cleanup()
      navigate("/signup/complete")
    } catch (error: unknown) {
      handleError(error)
      throw error
    }
  }

  const handleEmailSignup = async () => {
    try {
      const signupFormData = {
        userInfo: {
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          mobileno: signupData.mobileNumber,
          birthdate: signupData.birthDate,
          gender: signupData.gender,
          addr1: signupData.address1,
          addr2: signupData.address2 || "",
          marketing_yn: signupData.marketingYn,
          post: signupData.postCode,
          nationalinfo: "0",
          brand_code: signupData.brandCodes || [],
          profileUrl: signupData.profileUrl,
          profileURL: signupData.profileUrl,
        },
        authData: {
          di: signupData.di,
          token_version_id: signupData.tokenVersionId,
        },
        optional: {
          recom: signupData.referralCode,
        },
      }

      await signup(signupFormData)

      const loginResponse = await loginWithEmail({
        username: signupData.email,
        password: signupData.password,
        deviceToken: await requestForToken(),
        deviceType: window.osType ?? "web",
      })

      const accessToken = loginResponse.accessToken

      if (!accessToken) {
        throw new Error("로그인에 실패했습니다.")
      }

      // ReactNativeWebView 환경에서 accessToken 전달
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
      cleanup()
      navigate("/signup/complete")
    } catch (error: unknown) {
      handleError(error)
      throw error
    }
  }

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.resultMessage
      showToast(errorMessage || "회원가입에 실패했습니다")
    } else if (error instanceof Error) {
      showToast(error.message || "회원가입에 실패했습니다")
    } else {
      showToast("회원가입에 실패했습니다")
    }
  }

  const handleSubmit = async () => {
    try {
      const socialInfo = sessionStorage.getItem("socialSignupInfo")
      if (socialInfo) {
        const socialSignupInfo: SocialSignupInfo = JSON.parse(socialInfo)
        await handleSocialSignup(socialSignupInfo)
      } else {
        await handleEmailSignup()
      }
    } catch (error: unknown) {
      handleError(error)
    }
  }

  return {
    handleSubmit,
  }
}
