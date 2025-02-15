import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { XIcon } from "@components/icons/XIcon"
import CheckCircleIcon from "@assets/icons/CheckCircle.svg?react"
import { PaymentCompleteState } from "../../types/Payment"
import PaymentItemCard from "./_fragments/PaymentCompleteItemCard"
import PaymentInfo from "./_fragments/PaymentCompleteInfo"
import PaymentSummary from "./_fragments/PaymentCompleteSummary"
import { useOverlay } from "../../contexts/ModalContext"

const PaymentCompletePage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as PaymentCompleteState
  const { openModal } = useOverlay()

  useEffect(() => {
    if (!location.state) {
      navigate("/payment")
      return
    }

    setHeader({
      display: true,
      title: "결제완료",
      right: <XIcon onClick={() => navigate("/")} />,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const isAdditional = state.type === "additional"
  const isVirtual = state.paymentMethod === "VBANK"

  const handleNavigate = () => {
    try {
      if (isAdditional) {
        navigate("/member-history/reservation")
      } else {
        navigate("/reservation/form")
      }
    } catch (error) {
      openModal({
        title: "오류",
        message: "페이지 이동 중 오류가 발생했습니다.",
        onConfirm: () => {},
      })
      console.error("Navigation error:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-5 flex flex-col gap-4 items-center border-b-8 border-gray-50">
        <CheckCircleIcon />
        <p className="text-primary font-sb text-16px">결제가 완료되었습니다.</p>
      </div>

      <div className="p-5 border-b-8 border-gray-50">
        <div className="flex items-center gap-1 mb-4">
          <span className="text-gray-700 font-sb text-16px">주문내역</span>
          <span className="text-primary font-sb text-16px">
            {state.items.length}건
          </span>
        </div>
        {state.items.map((item) => (
          <PaymentItemCard
            key={item.p_idx}
            item={{
              id: item.p_idx,
              s_idx: 0,
              ss_idx: 0,
              b_idx: 0,
              brand_code: item.brand.code,
              amount: 1,
              b_type: item.branch.code === "0" ? "전지점" : "지정지점",
              title: item.title,
              brand: item.brand.name,
              branchType:
                item.branch.code === "0" ? "전지점 사용가능" : item.branch.name,
              duration: 0,
              price: Number(state.amount_info.total_amount),
              sessions: Number(item.sessions),
              name:
                item.branch.code === "0" ? "전지점 사용가능" : item.branch.name,
              type: "membership" as const,
            }}
          />
        ))}
      </div>

      <div className="border-b-8 border-gray-50">
        <PaymentInfo state={state} />
      </div>

      <PaymentSummary state={state} isVirtual={isVirtual} />

      <FixedButtonContainer className="bg-white">
        <div className="flex gap-2 w-full">
          <Button
            variantType="line"
            sizeType="m"
            onClick={() => navigate("/")}
            fullWidth
          >
            홈으로 돌아가기
          </Button>
          <Button
            variantType="primary"
            sizeType="m"
            onClick={handleNavigate}
            fullWidth
          >
            {isAdditional ? "예약내역 보기" : "예약하러 가기"}
          </Button>
        </div>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentCompletePage
