import { Button } from "@components/Button.tsx"
import { useOverlay } from "contexts/ModalContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const FindEmail = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { openModal } = useOverlay()
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
    const loginInfo = sessionStorage.getItem("loginInfo")
    if (loginInfo) {
      setLoginInfo(JSON.parse(loginInfo))
      sessionStorage.removeItem("loginInfo")
      return
    }

    openModal({
      title: "오류",
      message: "계정을 찾을 수 없습니다.",
      onConfirm: () => {
        navigate("/login", { replace: true })
      },
    })
  }, [])

  const navigateToLogin = () => {
    navigate("/login", { replace: true })
  }

  return (
    <div className="px-[20px] mt-[28px]">
      <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
        {loginInfo?.thirdPartyType === "email"
          ? "가입하신 이메일 계정입니다."
          : `${loginInfo?.thirdPartyType} 계정으로 가입되어 있습니다.`}
      </p>

      {loginInfo?.thirdPartyType === "email" && loginInfo.email && (
        <div className="flex justify-center items-center mt-[40px] h-[80px] w-full bg-[#FEF1F0] rounded-xl">
          <span className="font-[500]m text-16px text-primary-300">
            {loginInfo.email}
          </span>
        </div>
      )}

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
