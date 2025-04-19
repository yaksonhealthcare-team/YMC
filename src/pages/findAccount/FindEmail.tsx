import { Button } from "@components/Button.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const FindEmail = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [loginInfo, setLoginInfo] = useState<{
    thirdPartyType?: string
    email?: string
  } | null>(null)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })

    setNavigation({ display: false })
  }, [navigate, setHeader, setNavigation])

  useEffect(() => {
    const sessionLoginInfo = sessionStorage.getItem("loginInfo")
    if (sessionLoginInfo) {
      setLoginInfo(JSON.parse(sessionLoginInfo))
      sessionStorage.removeItem("loginInfo")
    }
  }, [])

  const navigateToLogin = () => {
    navigate("/login", { replace: true })
  }

  if (!loginInfo) {
    return <LoadingIndicator />
  }

  if (!loginInfo.thirdPartyType) {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          계정을 찾을 수 없습니다.
        </p>

        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    )
  }

  if (loginInfo.thirdPartyType === "E") {
    if (!loginInfo.email) {
      return (
        <div className="px-[20px] mt-[28px]">
          <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
            계정을 찾을 수 없습니다.
          </p>
          <Button
            variantType="primary"
            sizeType="l"
            className="h-[52px] mt-[40px] font-[700] text-16px w-full"
            onClick={navigateToLogin}
          >
            로그인 페이지로 이동
          </Button>
        </div>
      )
    }

    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          가입하신 이메일 계정입니다.
        </p>

        <div className="flex justify-center items-center mt-[40px] h-[80px] w-full bg-[#FEF1F0] rounded-xl">
          <span className="font-[500]m text-16px text-primary-300">
            {loginInfo.email}
          </span>
        </div>

        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    )
  }

  return (
    <div className="px-[20px] mt-[28px]">
      <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
        {`${loginInfo.thirdPartyType} 계정으로 가입되어 있습니다.`}
      </p>
      <Button
        variantType="primary"
        sizeType="l"
        className="h-[52px] mt-[40px] font-[700] text-16px w-full"
        onClick={navigateToLogin}
      >
        로그인 페이지로 이동
      </Button>
    </div>
  )
}

export default FindEmail
