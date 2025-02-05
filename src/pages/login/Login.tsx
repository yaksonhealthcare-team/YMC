import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import Logo from "@components/Logo"
import { Button } from "@components/Button"
import { Typography } from "@mui/material"
import KakaoIcon from "../../assets/icons/KakaoIcon.svg?react"
import NaverIcon from "../../assets/icons/NaverIcon.svg?react"
import AppleIcon from "../../assets/icons/AppleIcon.svg?react"
import { getNaverLoginUrl } from "../../libs/naver"
import GoogleIcon from "../../assets/icons/GoogleIcon.svg?react"
import { getGoogleLoginUrl } from "../../libs/google"
import { getAppleLoginUrl } from "../../libs/apple"

const Login = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

  const handleSocialLogin = async (
    provider: "kakao" | "naver" | "google" | "apple",
  ) => {
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
    }

    if (url) window.location.href = url
  }

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://devapi.yaksonhc.com/api/auth/kakao_login?scope=account_email`
    window.location.href = kakaoAuthUrl
  }

  return (
    <div className="flex flex-col min-h-screen max-h-[100vh] bg-[#F8F5F2]">
      {/* 로고 */}
      <div className="min-h-[180px] h-full flex justify-center items-center">
        <Logo text size={191} />
      </div>

      {/* 로그인 버튼 그룹과 회원가입 */}
      <div className="flex-1 flex flex-col justify-end">
        {/* 로그인 버튼 그룹 */}
        <div className="px-5 flex flex-col gap-3">
          {/* 카카오 로그인 */}
          <Button
            onClick={handleKakaoLogin}
            fullCustom
            sizeType="l"
            className="bg-[#FEE500] border-[#FEE500] text-[#262626] font-b flex items-center px-3 py-4"
          >
            <KakaoIcon className="w-6 h-6" />
            <span className="flex-1 text-center">카카오톡으로 로그인</span>
          </Button>

          {/* 네이버 로그인 */}
          <Button
            onClick={() => handleSocialLogin("naver")}
            fullCustom
            sizeType="l"
            className="bg-[#03C75A] border-[#03C75A] text-white font-b flex items-center px-3 py-4"
          >
            <NaverIcon className="w-6 h-6 text-white" />
            <span className="flex-1 text-center">네이버로 로그인</span>
          </Button>

          {/* TODO: iOS에서만 애플 로그인 버튼 표시 */}
          <Button
            onClick={() => handleSocialLogin("apple")}
            fullCustom
            sizeType="l"
            className="bg-[#000000] border-black text-white font-b flex items-center px-3 py-4"
          >
            <AppleIcon className="w-6 h-6 text-white" />
            <span className="flex-1 text-center">Apple로 로그인</span>
          </Button>

          {/* 구글 로그인 */}
          <Button
            onClick={() => handleSocialLogin("google")}
            fullCustom
            sizeType="l"
            className="bg-white border-[#DDDDDD] text-[#212121] font-b flex items-center px-3 py-4"
          >
            <GoogleIcon className="w-6 h-6" />
            <span className="flex-1 text-center">Google로 로그인</span>
          </Button>

          {/* 이메일 로그인 */}
          <Button
            variantType="primary"
            sizeType="l"
            onClick={() => navigate("/login/email")}
          >
            이메일로 로그인
          </Button>
        </div>

        {/* 회원가입 */}
        <div className="mt-[60px] mb-[60px] flex justify-center items-center gap-5">
          <Typography className="text-gray-500 font-sb text-16px">
            처음이신가요?
          </Typography>
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-sb text-16px underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
