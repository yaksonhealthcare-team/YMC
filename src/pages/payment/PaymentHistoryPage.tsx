import { EmptyCard } from "@components/EmptyCard"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"
import { usePaymentHistories } from "../../queries/usePaymentQueries.tsx"
import PaymentHistoryListItem from "./_fragments/PaymentHistoryListItem.tsx"

const PaymentHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const {
    data: payments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
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
    setNavigation({ display: true })
  }, [])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  if (isFetchingNextPage) {
    return <LoadingIndicator className="min-h-[100px]" />
  }

  return (
    <div className={"h-full flex flex-col overflow-hidden"}>
      {payments && payments.pages.length > 0 && payments.pages[0].length > 0 ? (
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
        </ul>
      ) : (
        <EmptyCard
          title={`결제 내역이 없어요.\n결제 내역이 생기면 이곳에 표시됩니다.`}
        />
      )}
    </div>
  )
}

export default PaymentHistoryPage
