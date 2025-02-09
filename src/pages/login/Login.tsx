import { Button } from "@components/Button"
import Logo from "@components/Logo"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppleIcon from "../../assets/icons/AppleIcon.svg?react"
import GoogleIcon from "../../assets/icons/GoogleIcon.svg?react"
import KakaoIcon from "../../assets/icons/KakaoIcon.svg?react"
import NaverIcon from "../../assets/icons/NaverIcon.svg?react"
import { useLayout } from "../../contexts/LayoutContext"
import { getAppleLoginUrl } from "../../libs/apple"
import { getGoogleLoginUrl } from "../../libs/google"
import { getNaverLoginUrl } from "../../libs/naver"

declare global {
  interface Window {
    osType?: "ios" | "android"
    fcmToken?: string
  }
}

const Login = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [osType, _setOsType] = useState<"ios" | "android" | undefined>(() => {
    const savedOsType = localStorage.getItem("osType")
    if (window.osType) {
      localStorage.setItem("osType", window.osType)
      return window.osType
    }
    if (savedOsType === "ios" || savedOsType === "android") {
      return savedOsType
    }
    return undefined
  })

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    if (osType) {
      localStorage.setItem("osType", osType)
    }
  }, [osType])

  const handleSocialLogin = async (
    provider: "kakao" | "naver" | "google" | "apple",
  ) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "SOCIAL_LOGIN",
          provider,
        }),
      )
      return
    }
    let url = ""

    switch (provider) {
      case "naver":
        url = getNaverLoginUrl()
        break
      case "google":
        url = await getGoogleLoginUrl()
        break
      case "apple":
        url = getAppleLoginUrl()
        break
      case "kakao":
        url = getKakaoLoginUrl()
        break
    }

    if (url) window.location.href = url
  }

  const getKakaoLoginUrl = () => {
    return `https://devapi.yaksonhc.com/api/auth/kakao_login?scope=account_email`
  }

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#F8F5F2]">
      {/* 로고 */}
      <div className="mt-[30%] mb-[10%] flex justify-center">
        <Logo text size={191} />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3 px-5 mt-auto mb-auto">
        {/* 카카오 로그인 */}
        <Button
          onClick={() => handleSocialLogin("kakao")}
          fullCustom
          sizeType="l"
          className="bg-[#FEE500] border-[#FEE500] text-[#262626] font-b flex items-center px-5 py-[13.75px] rounded-[12px] relative"
        >
          <KakaoIcon className="w-6 h-6 absolute left-5" />
          <span className="flex-1 text-center text-16px">
            카카오톡으로 로그인
          </span>
        </Button>

        {/* 네이버 로그인 */}
        <Button
          onClick={() => handleSocialLogin("naver")}
          fullCustom
          sizeType="l"
          className="bg-[#03C75A] border-[#03C75A] text-white font-b flex items-center px-5 h-[52px] rounded-[12px] relative"
        >
          <NaverIcon className="w-6 h-6 text-white absolute left-5" />
          <span className="flex-1 text-center text-16px">네이버로 로그인</span>
        </Button>

        {/* 구글 로그인 (웹 또는 Android에서만 표시) */}
        {(!osType || osType === "android") && (
          <Button
            onClick={() => handleSocialLogin("google")}
            fullCustom
            sizeType="l"
            className="bg-white border-[#ECECEC] text-[#212121] font-b flex items-center px-5 h-[52px] border border-solid rounded-[12px] relative"
          >
            <GoogleIcon className="w-6 h-6 absolute left-5" />
            <span className="flex-1 text-center text-16px">
              Google로 로그인
            </span>
          </Button>
        )}

        {/* 애플 로그인 (웹 또는 iOS에서만 표시) */}
        {(!osType || osType === "ios") && (
          <Button
            onClick={() => handleSocialLogin("apple")}
            fullCustom
            sizeType="l"
            className="bg-[#000000] border-black text-white font-b flex items-center px-5 h-[52px] rounded-[12px] relative"
          >
            <AppleIcon className="w-6 h-6 text-white absolute left-5" />
            <span className="flex-1 text-center text-16px">Apple로 로그인</span>
          </Button>
        )}

        {/* 이메일 로그인 */}
        <Button
          fullCustom
          sizeType="l"
          className="bg-primary border-primary text-white font-b flex items-center px-5 h-[52px] rounded-[12px] relative"
          onClick={() => navigate("/login/email")}
        >
          <div className="w-6 h-6 absolute left-5" />
          <span className="flex-1 text-center text-16px">이메일로 로그인</span>
        </Button>
      </div>
      <div className="mb-[7%] flex justify-center items-center gap-5">
        <Typography className="text-gray-500 font-sb text-16px">
          처음이신가요?
        </Typography>
        <button
          onClick={() => navigate("/signup/terms")}
          className="text-primary font-sb text-16px underline"
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

export default Login
