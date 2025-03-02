import LoadingIndicator from "@components/LoadingIndicator"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { usePaymentHistory } from "../../queries/usePaymentQueries.tsx"
import PaymentCancelReasonSection from "./_fragments/detail/PaymentCancelReasonSection.tsx"
import PaymentItemSection from "./_fragments/detail/PaymentItemSection.tsx"
import PaymentPointSection from "./_fragments/detail/PaymentPointSection.tsx"
import PaymentRefundDescriptionSection from "./_fragments/detail/PaymentRefundDescriptionSection.tsx"

const PaymentCancelDetailPage = () => {
  const { id } = useParams()
  const { setHeader, setNavigation } = useLayout()
  const { data: payment, isLoading } = usePaymentHistory(id!)

  useEffect(() => {
    setHeader({
      left: "back",
      title: "취소 상세 내역",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading || !payment) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className={"h-full flex flex-col justify-between overflow-hidden"}>
      <div className={"flex flex-col overflow-scroll pb-8"}>
        <div className={"mt-6 px-5"}>
          <PaymentItemSection payment={payment} hideButton={true} />
        </div>

        {/* 취소 상세 정보 */}
        <div
          className={
            "mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50"
          }
        >
          <PaymentCancelReasonSection {...payment.items[0].cancel} />
        </div>

        {/* 환불 정보 */}
        <div
          className={
            "mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50"
          }
        >
          <h3 className="text-gray-500 text-14px mb-2">환불정보</h3>
          <PaymentRefundDescriptionSection payment={payment} />
        </div>

        {/* 포인트 정보 */}
        <div
          className={
            "mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50"
          }
        >
          <PaymentPointSection payment={payment} />
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelDetailPage
