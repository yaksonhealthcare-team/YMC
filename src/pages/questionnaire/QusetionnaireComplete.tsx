import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@components/Button"
import { useLayout } from "contexts/LayoutContext"
import { useEffect } from "react"
import FixedButtonContainer from "@components/FixedButtonContainer"
import ReceiptEditIcon from "@assets/icons/ReceiptEditIcon.svg?react"

interface LocationState {
  returnPath?: string
  returnText?: string
}

const QuestionnaireComplete = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setHeader, setNavigation } = useLayout()
  const { returnPath = "/", returnText = "홈으로" } =
    (location.state as LocationState) || {}

  useEffect(() => {
    setHeader({
      display: true,
      title: "",
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  return (
    <div className="flex flex-col items-center justify-between h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="w-[60px] h-[60px] mb-7">
          <ReceiptEditIcon />
        </div>

        <h1 className="text-gray-700 text-xl font-semibold mb-7 text-center">
          문진 내용이 등록되었어요
        </h1>

        <p className="text-gray-400 text-sm font-medium text-center">
          문진 내용은 마이페이지 '내 문진'에서
          <br />
          확인 및 수정이 가능합니다
        </p>
      </div>

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={() => navigate(returnPath)}
          className="w-full"
        >
          {returnText}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default QuestionnaireComplete
