import { useParams } from "react-router-dom"
import { usePaymentHistory } from "../../queries/usePaymentQueries.tsx"
import SplashScreen from "@components/Splash.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { Button } from "@components/Button.tsx"
import PaymentDescriptionSection from "./_fragments/detail/PaymentDescriptionSection.tsx"
import PaymentPointSection from "./_fragments/detail/PaymentPointSection.tsx"
import PaymentItemSection from "./_fragments/detail/PaymentItemSection.tsx"
import PaymentCancelReasonSection from "./_fragments/detail/PaymentCancelReasonSection.tsx"
import PaymentRefundDescriptionSection from "./_fragments/detail/PaymentRefundDescriptionSection.tsx"

const PaymentHistoryDetailPage = () => {
  const { id } = useParams()
  const { setHeader, setNavigation } = useLayout()
  const { data: payment, isLoading } = usePaymentHistory(id!)
  const canceled = payment?.status.includes("취소") || false

  useEffect(() => {
    setHeader({
      left: "back",
      title: "결제 상세 내역",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading || !payment) {
    return <SplashScreen />
  }

  const renderFooter = () => {
    if (payment.category === "additional") {
      return (
        <div className={"border-t border-gray-200 px-5 pt-3 pb-8"}>
          <Button className={"w-full"}>{"예약 내역 보기"}</Button>
        </div>
      )
    }

    if (canceled) return null

    return (
      <div className={"border-t border-gray-200 px-5 pt-3 pb-8"}>
        <Button className={"w-full"}>{"결제 취소하기"}</Button>
      </div>
    )
  }

  return (
    <div className={"h-full flex flex-col justify-between overflow-hidden"}>
      <div className={"flex flex-col overflow-scroll"}>
        <div className={"mt-6 px-5"}>
          <PaymentItemSection payment={payment} />
        </div>
        {payment.category === "additional" && (
          <>
            <div className={"h-2 bg-gray-50 mt-6"} />
            <div className={"mt-6 px-5 flex flex-col gap-3"}>
              <p className={"text-14px text-gray-500 font-m"}>
                {"추가 관리 항목"}
              </p>
              <p className={"font-sb text-14px"}>
                {payment.items.map((item) => item.name).join(" / ")}
              </p>
            </div>
          </>
        )}
        {payment.category === "additional" && canceled && (
          <>
            <div className={"h-2 bg-gray-50 mt-6"} />
            <PaymentCancelReasonSection {...payment.items[0].cancel} />
          </>
        )}
        <div className={"h-2 bg-gray-50 mt-6"} />
        <div className={"mt-6 px-5"}>
          <PaymentDescriptionSection payment={payment} />
        </div>
        {payment.category === "additional" && canceled && (
          <>
            <div className={"h-2 bg-gray-50 mt-6"} />
            <div className={"mt-6 px-5"}>
              <PaymentRefundDescriptionSection payment={payment} />
            </div>
          </>
        )}
        <div className={"h-2 bg-gray-50 mt-6"} />
        <div className={"mt-6 px-5"}>
          <PaymentPointSection payment={payment} />
        </div>
      </div>
      {renderFooter()}
    </div>
  )
}

export default PaymentHistoryDetailPage
