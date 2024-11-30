import { Button } from "@components/Button.tsx"
import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"

const FindEmail = () => {
  const [email, setEmail] = useState<string>()
  const { setHeader } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })
  }, [])

  useEffect(() => {
    setEmail("leolap@naver.com")
  }, [])

  const navigateToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="px-[20px] mt-[28px]">
      <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
        가입하신 이메일 계정입니다.
      </p>

      <div className="flex justify-center items-center mt-[40px] h-[80px] w-full bg-[#FEF1F0] rounded-xl">
        <span className="font-[500]m text-16px text-primary-300">
          {email}
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

export default FindEmail