import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { usePaymentHistories } from "../../queries/usePaymentQueries.tsx"
import PaymentHistoryListItem from "./_fragments/PaymentHistoryListItem.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"
import { useNavigate } from "react-router-dom"
import SplashScreen from "@components/Splash.tsx"

const PaymentHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const {
    data: payments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaymentHistories()

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      title: "결제 내역",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (!payments) return <SplashScreen />

  return (
    <div className={"h-full flex flex-col overflow-hidden"}>
      <ul className={"divide-[#F7F8Fb] divide-y-8 overflow-y-scroll"}>
        {payments.pages.map((page) =>
          page.map((payment, index) => (
            <li
              key={index}
              className={"p-5"}
              onClick={() => navigate(`/payment/${payment.index}`)}
            >
              <PaymentHistoryListItem payment={payment} />
            </li>
          )),
        )}
        <div ref={observerTarget} className={"h-4 bg-[#F7F8Fb]"} />
        {isFetchingNextPage && (
          <div className={"text-center text-gray-500 py-4 bg-[#F7F8Fb]"}>
            로딩 중...
          </div>
        )}
      </ul>
    </div>
  )
}

export default PaymentHistoryPage
