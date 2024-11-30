import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"

const FindAccount = () => {
  const { setHeader, setNavigation } = useLayout()
  const [tab, setTab] = useState<"find-email" | "reset-password">("find-email")
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "계정 찾기",
      left: "back",
      backgroundColor: "bg-white",
    })

    setNavigation({ display: false })
  }, [])

  const handleTabClick = (path: "find-email" | "reset-password") => {
    setTab(path)
  }

  const handleAuthClick = () => {
    navigate(tab)
  }

  return (
    <>
      <div className="h-[48px] px-5 border-b border-gray-100 flex items-center">
        <div className="relative flex items-center gap-[8px] text-14px font-[600] w-full h-full">
          <div
            onClick={() => handleTabClick("find-email")}
            className={`flex-1 text-center cursor-pointer w-[] ${
              tab === "find-email"
                ? "text-[#212121]"
                : "text-[#9E9E9E]"
            }`}
          >
            이메일 찾기
          </div>

          <div
            onClick={() => handleTabClick("reset-password")}
            className={`flex-1 text-center cursor-pointer ${
              tab === "reset-password"
                ? "text-[#212121]"
                : "text-[#9E9E9E]"
            }`}
          >
            비밀번호 찾기
          </div>

          <div
            className={`absolute bottom-0 h-[2px] bg-black transition-transform duration-300 ease-in-out ${
              tab === "reset-password" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
            } w-[calc(50%-4px)]`}
          />
        </div>
      </div>

      <div className="mt-[80px] px-[20px]">
        <p className="flex flex-col justify-center items-center mt-[28px] font-[600] text-20px text-[#212121]">
          <span>계정을 찾기 위해선</span>
          <span>본인인증이 필요해요</span>
        </p>

        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={handleAuthClick}
        >
          본인인증 하러가기
        </Button>
      </div>
    </>
  )
}

export default FindAccount