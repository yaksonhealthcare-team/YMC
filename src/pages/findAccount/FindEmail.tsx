import { Button } from "@components/Button.tsx"
import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate, useLocation } from "react-router-dom"
import { findEmail } from "../../apis/auth.api.ts"
import { useOverlay } from "../../contexts/ModalContext"

const FindEmail = () => {
  const { setHeader } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const verifiedData = location.state?.verifiedData
  const { openAlert } = useOverlay()
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })

    // 본인인증 데이터가 없으면 계정찾기 페이지로 이동
    if (!verifiedData) {
      navigate("/find-account")
      return
    }

    // 본인인증 데이터로 이메일 찾기
    const fetchEmail = async () => {
      try {
        const foundEmail = await findEmail({
          name: verifiedData.name,
          mobileNumber: verifiedData.mobileNumber,
          birthDate: verifiedData.birthDate,
        })
        setEmail(foundEmail)
      } catch (error) {
        openAlert({
          title: "오류",
          description: "이메일을 찾을 수 없습니다.",
        })
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmail()
  }, [verifiedData, navigate, openAlert])

  const navigateToLogin = () => {
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          이메일을 찾고 있습니다...
        </p>
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