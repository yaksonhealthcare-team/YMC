import { Button } from "@components/Button.tsx"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import CheckCircle from "@assets/icons/CheckCircle.svg?react"

export const SignupComplete = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  return (
    <div className="flex flex-col items-center px-5 pt-[144px]">
      <div className="flex flex-col items-center gap-7">
        {/* 체크 아이콘 */}
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          <CheckCircle className="w-[60px] h-[60px] text-primary" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-primary text-20px font-semibold leading-[30px]">
              가입 완료!
            </p>
            <p className="text-[#212121] text-20px font-semibold leading-[30px]">
              김민정님, 환영해요
            </p>
          </div>
          <p className="text-[#9E9E9E] text-14px font-medium text-center leading-[21px]">
            기존 약손명가, 달리아스파, 여리한 다이어트를
            <br />
            이용해보신 경험이 있으신가요?
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#F8F8F8] bg-white p-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              navigate("/questionnaire/common")
            }}
            className="h-12 px-4 py-3 text-primary text-16px font-semibold"
          >
            처음 이용해요
          </button>
          <Button
            variantType="primary"
            sizeType="l"
            onClick={() => {
              navigate("/signup/branch")
              /* TODO: 기존 회원 연동 */
            }}
          >
            네, 이용해봤어요
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SignupComplete
