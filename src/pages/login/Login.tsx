import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { useAuth } from "../../contexts/AuthContext"
import { loginWithSocial, fetchUser } from "../../apis/auth.api"
import Logo from "@components/Logo"
import { Button } from "@components/Button"
import { Typography } from "@mui/material"
import KakaoIcon from "../../assets/icons/KakaoIcon.svg?react"
import NaverIcon from "../../assets/icons/NaverIcon.svg?react"
import AppleIcon from "../../assets/icons/AppleIcon.svg?react"
import { getNaverLoginUrl } from "../../libs/naver"
import { signInWithGoogle, signInWithApple } from "../../libs/social"

// 소셜 로그인 설정
const SOCIAL_CONFIG = {
  kakao: {
    clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/kakao`,
  },
  naver: {
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/naver`,
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/apple`,
  },
}

// provider 코드 변환 함수 추가
const getProviderCode = (provider: string): "K" | "N" | "G" | "A" => {
  switch (provider) {
    case "kakao":
      return "K"
    case "naver":
      return "N"
    case "google":
      return "G"
    case "apple":
      return "A"
    default:
      throw new Error("Invalid provider")
  }
}

const Login = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  const handleSocialLogin = async (
    provider: "kakao" | "naver" | "google" | "apple",
  ) => {
    try {
      let socialAccessToken = ""

      switch (provider) {
        case "naver":
          window.location.href = getNaverLoginUrl()
          return // 리다이렉트되므로 여기서 return
        case "google":
          socialAccessToken = await signInWithGoogle()
          break
        case "apple":
          socialAccessToken = await signInWithApple()
          break
        // ... 기존 케이스들
      }

      if (socialAccessToken) {
        const { accessToken } = await loginWithSocial({
          provider: getProviderCode(provider),
          accessToken: socialAccessToken,
        })

        const user = await fetchUser(accessToken)
        login({ user, token: accessToken })
        navigate("/")
      }
    } catch (error) {
      console.error("Social login failed:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5F2]">
      {/* 로고 */}
      <div className="mt-[159px] flex justify-center">
        <Logo text size={191} />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="mt-[205px] px-5 flex flex-col gap-3">
        {/* 카카오 로그인 */}
        <Button
          onClick={() => handleSocialLogin("kakao")}
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

        {/* TODO: 애플 로그인 웹 지원 여부 확인 필요 */}
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
      <div className="mt-auto mb-[84px] flex justify-center items-center gap-5">
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

      {/* 하단 바 */}
      <div className="w-full h-[42px] border-t border-[#F8F8F8] flex justify-center items-end pb-5">
        <div className="w-[130px] h-[5px] bg-[#131313] rounded-[2px]" />
      </div>
    </div>
  )
}

export default Login
