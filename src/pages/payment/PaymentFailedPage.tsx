import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import ErrorIcon from "@assets/icons/ErrorIcon.svg?react"

interface LocationState {
  error: string
  code: string
}

const PaymentFailedPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  useEffect(() => {
    setHeader({
      display: true,
      title: "결제 실패",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({
      display: false,
    })
  }, [])

  const handleRetry = () => {
    navigate(-3)
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 items-center justify-center p-5">
        <ErrorIcon className="w-16 h-16 text-error mb-4" />
        <h1 className="text-20px font-sb text-gray-700 mb-2">
          결제에 실패했습니다
        </h1>
        <p className="text-14px font-r text-gray-500 text-center mb-2">
          {state?.error || "결제 중 오류가 발생했습니다."}
        </p>
        {state?.code && (
          <p className="text-12px font-r text-gray-400">
            오류 코드: {state.code}
          </p>
        )}
      </div>

      <FixedButtonContainer className="gap-3">
        <Button
          variantType="grayLine"
          sizeType="l"
          onClick={handleGoHome}
          className="flex-1"
        >
          홈으로
        </Button>
        <Button
          variantType="primary"
          sizeType="l"
          onClick={handleRetry}
          className="flex-1"
        >
          돌아가기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentFailedPage
