import { useLayout } from "../../../contexts/LayoutContext"
import { useEffect } from "react"
import { useReservations } from "../../../queries/useReservationQueries"
import useIntersection from "../../../hooks/useIntersection"
import LoadingIndicator from "@components/LoadingIndicator"
import { ReserveCard } from "@components/ReserveCard"

const ReservationHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const {
    data: reservations,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useReservations()

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
      title: "예약 내역",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) return <LoadingIndicator className="min-h-screen" />
  if (!reservations) return null

  return (
    <div className="flex flex-col">
      {reservations.pages.map((page) =>
        page.map((reservation) => (
          <ReserveCard
            key={reservation.id}
            reservation={reservation}
            className="border-b border-gray-100 rounded-none"
          />
        )),
      )}
      <div ref={observerTarget} className="h-4" />
      {isFetchingNextPage && <LoadingIndicator className="min-h-[100px]" />}
    </div>
  )
}

export default ReservationHistoryPage
