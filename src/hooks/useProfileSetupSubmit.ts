import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useOverlay } from "../contexts/ModalContext"
import { useSignup } from "../contexts/SignupContext"
import { AxiosError } from "axios"
import {
  signinWithSocial,
  signupWithSocial,
  signup,
  loginWithEmail,
  fetchUser,
} from "../apis/auth.api"

type SocialProvider = "N" | "K" | "G" | "A"

interface SocialSignupInfo {
  provider: SocialProvider
  id: string
  name?: string
  email?: string
  mobileno?: string
  birthdate?: string
  gender?: string
  socialId: string
}

export const useProfileSetupSubmit = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useOverlay()
  const { signupData, cleanup } = useSignup()

  const handleSocialSignup = async (socialInfo: SocialSignupInfo) => {
    try {
      const response = await signupWithSocial({
        provider: socialInfo.provider,
        userInfo: {
          ...socialInfo,
          id: socialInfo.id,
          name: signupData.name,
          email: signupData.email,
          mobileno: signupData.mobileNumber,
          birthdate: signupData.birthDate,
          gender: signupData.gender === "male" ? "M" : "F",
          post: signupData.postCode,
          addr1: signupData.address1,
          addr2: signupData.address2 || "",
          marketing_yn: signupData.marketingYn ? "Y" : "N",
          brand_code: signupData.brandCodes || [],
        },
      })

      if (
        !response ||
        !response.body ||
        !Array.isArray(response.body) ||
        response.body.length === 0
      ) {
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
        provider: socialInfo.provider,
        socialAccessToken: response.body[0].accessToken,
        socialId: socialInfo.socialId,
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
          password: signupData.password!,
          mobileno: signupData.mobileNumber,
          birthdate: signupData.birthDate,
          gender: signupData.gender === "male" ? "M" : "F",
          addr1: signupData.address1,
          addr2: signupData.address2 || "",
          marketing_yn: signupData.marketingYn,
          post: signupData.postCode,
          nationalinfo: "0",
          brand_code: signupData.brandCodes || [],
        },
        authData: {
          di: signupData.di,
        },
        optional: {
          recom: signupData.referralCode,
        },
      }

      await signup(signupFormData)

      const { accessToken } = await loginWithEmail({
        username: signupData.email,
        password: signupData.password!,
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
      const socialInfo = JSON.parse(
        sessionStorage.getItem("socialSignupInfo") || "{}",
      ) as SocialSignupInfo
      const isSocialSignup = !!socialInfo.provider

      if (isSocialSignup) {
        await handleSocialSignup(socialInfo)
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
