import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import LoadingIndicator from "@components/LoadingIndicator"
import { useQuery } from "@tanstack/react-query"
import { usePayment } from "hooks/usePayment"
import { usePaymentHandlers } from "hooks/usePaymentHandlers"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatPriceWithUnit } from "utils/format"
import { fetchPoints } from "../../apis/points.api"
import { useLayout } from "../../contexts/LayoutContext"
import { usePaymentStore } from "../../hooks/usePaymentStore"
import PaymentAgreementSection from "./_fragments/PaymentAgreementSection"
import PaymentMethodSection from "./_fragments/PaymentMethodSection"
import PaymentPointSection from "./_fragments/PaymentPointSection"
import PaymentProductSection from "./_fragments/PaymentProductSection"
import PaymentSummarySection from "./_fragments/PaymentSummarySection"

/**
 * TODO: 결제 연동 관련 확인사항
 * 1. UI/UX 개선
 *   - 결제수단별 아이콘 추가
 *   - 결제수단 선택 UI 디자인 검토
 *   - 모바일 웹/앱 대응 UI 확인
 *
 * 2. 결제수단 정책 확인
 *   - 실시간계좌이체(BANK) 지원 여부 확인
 *   - 각 결제수단별 테스트 계정 정보 확인
 *   - 결제취소 정책 확인
 *
 * 3. 기술검토 사항
 *   - P_RESERVED 파라미터 옵션 최적화
 *   - 에러코드별 대응 방안 수립
 *   - 모바일 앱 스키마 정책 확인
 */

const PaymentPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { items, points, setPaymentMethod } = usePaymentStore()
  const { handlePayment, calculateTotalAmount } = usePayment()
  const {
    handlePointChange,
    handleUseAllPoints,
    handleCountChange,
    handleDelete,
  } = usePaymentHandlers()

  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "bank" | "vbank"
  >("card")
  const [isAgreed, setIsAgreed] = useState(false)

  const { data: availablePoints = 0, isLoading: isPointsLoading } = useQuery({
    queryKey: ["points"],
    queryFn: fetchPoints,
    retry: false,
  })

  const totalAmount = calculateTotalAmount(items)

  useEffect(() => {
    if (availablePoints > 0) {
      usePaymentStore.setState((state) => ({
        points: {
          ...state.points,
          availablePoints,
        },
      }))
    }
  }, [availablePoints])

  useEffect(() => {
    setHeader({
      display: true,
      title: "결제하기",
      left: "back",
      onClickBack: () => navigate(-1),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, navigate])

  if (isPointsLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  const handlePaymentMethodChange = (method: "card" | "bank" | "vbank") => {
    setSelectedPayment(method)
    setPaymentMethod(method)
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <PaymentProductSection
        items={items}
        onCountChange={handleCountChange}
        onDelete={handleDelete}
      />

      <PaymentPointSection
        availablePoints={points.availablePoints}
        usedPoints={points.usedPoints}
        onPointChange={handlePointChange}
        onUseAllPoints={handleUseAllPoints}
      />

      <PaymentMethodSection
        selectedPayment={selectedPayment}
        onPaymentMethodChange={handlePaymentMethodChange}
      />

      <PaymentSummarySection
        totalAmount={items.reduce(
          (total, item) => total + item.price * item.amount,
          0,
        )}
        discountAmount={0}
        pointAmount={points.usedPoints}
        finalAmount={Math.max(
          items.reduce((total, item) => total + item.price * item.amount, 0) -
            points.usedPoints,
          0,
        )}
      />

      <PaymentAgreementSection
        isAgreed={isAgreed}
        onAgreementChange={setIsAgreed}
      />

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={handlePayment}
          disabled={!isAgreed}
          className="w-full"
        >
          {formatPriceWithUnit(Math.max(totalAmount - points.usedPoints, 0))}{" "}
          결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentPage
