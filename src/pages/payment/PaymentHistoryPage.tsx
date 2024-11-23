import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useCallback, useEffect, useRef } from "react"
import { usePaymentHistories } from "../../queries/usePaymentQueries.tsx"
import PaymentHistoryCard from "./_fragments/PaymentHistoryCard.tsx"

const PaymentHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const {
    data: payments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaymentHistories()
  const observerTarget = useRef(null)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      title: "결제 내역",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 })
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [onIntersect])

  if (!payments) return <></>

  return (
    <div className={"h-full flex flex-col overflow-hidden"}>
      <ul className={"divide-[#F7F8Fb] divide-y-8 overflow-y-scroll"}>
        {payments.pages.map((page) =>
          page.map((payment, index) => (
            <li key={index} className={"p-5"}>
              <PaymentHistoryCard payment={payment} />
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
