import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import Logo from "@components/Logo"
import { Button } from "@components/Button"
import { Typography } from "@mui/material"
import KakaoIcon from "../../assets/icons/KakaoIcon.svg?react"
import NaverIcon from "../../assets/icons/NaverIcon.svg?react"
import AppleIcon from "../../assets/icons/AppleIcon.svg?react"

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

const Login = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  const handleSocialLogin = (provider: "kakao" | "naver" | "apple") => {
    let authUrl = ""

    switch (provider) {
      case "kakao":
        authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${SOCIAL_CONFIG.kakao.clientId}&redirect_uri=${SOCIAL_CONFIG.kakao.redirectUri}&response_type=code`
        break
      case "naver":
        const state = Math.random().toString(36).substr(2, 11)
        localStorage.setItem("naverState", state)
        authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/callback/naver&state=${state}`
        break
      case "apple":
        // Apple 로그인은 플랫폼에 따라 다르게 처리
        if (isPlatform("ios")) {
          // iOS 네이티브 애플 로그인 처리
        } else {
          authUrl = `https://appleid.apple.com/auth/authorize?client_id=${SOCIAL_CONFIG.apple.clientId}&redirect_uri=${SOCIAL_CONFIG.apple.redirectUri}&response_type=code&scope=name email`
        }
        break
    }

    if (authUrl) {
      window.location.href = authUrl
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

        {/* TODO: 기기 OS에 따라 애플/구글 로그인 다르게 처리*/}
        {/* 애플 로그인 */}
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
