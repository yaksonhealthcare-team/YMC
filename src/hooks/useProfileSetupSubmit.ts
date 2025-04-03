import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import {
  fetchUser,
  loginWithEmail,
  signinWithSocial,
  signup,
  signupWithSocial,
} from "../apis/auth.api"
import { useAuth } from "../contexts/AuthContext"
import { useOverlay } from "../contexts/ModalContext"
import { useSignup } from "../contexts/SignupContext"

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
        },
      })

      if (!response?.body?.length) {
        throw new Error(
          response?.resultMessage || "회원가입 응답에 유효한 body가 없습니다",
        )
      }

      if (!response.body[0]?.accessToken) {
        throw new Error(
          response?.resultMessage || "회원가입 응답에 accessToken이 없습니다",
        )
      }

      const { accessToken } = await signinWithSocial({
        thirdPartyType: socialInfo.thirdPartyType,
        SocialAccessToken: response.body[0].accessToken,
        socialId: socialInfo.socialId,
        id_token: socialInfo.id_token,
        SocialRefreshToken: socialInfo.SocialRefreshToken,
        deviceToken: socialInfo.deviceToken,
        deviceType: socialInfo.deviceType,
      })

      const user = await fetchUser(accessToken)
      login({ user, token: accessToken })
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

      const { accessToken } = await loginWithEmail({
        username: signupData.email,
        password: signupData.password,
      })

      const user = await fetchUser(accessToken)
      login({ user, token: accessToken })
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
