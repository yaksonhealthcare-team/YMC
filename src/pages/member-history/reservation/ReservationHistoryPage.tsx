import { useLayout } from "../../../contexts/LayoutContext"
import { useEffect } from "react"
import { useReservations } from "../../../queries/useReservationQueries"
import useIntersection from "../../../hooks/useIntersection"
import LoadingIndicator from "@components/LoadingIndicator"
import { useNavigate } from "react-router-dom"
import { ReservationStatusLabel } from "../../../types/Reservation"

const ReservationHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
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
          <div key={reservation.id} className="flex flex-col">
            <div
              className="flex flex-col gap-4 p-5 border-b border-gray-100"
              onClick={() => navigate(`/reservation/${reservation.id}`)}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-14px">
                  {reservation.store}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-m text-14px">
                    {ReservationStatusLabel[reservation.status]}
                  </span>
                  {reservation.status === "000" && (
                    <button
                      type="button"
                      className="text-gray-500 font-m text-14px"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(
                          `/reservation/${reservation.id}/satisfaction`,
                          {
                            state: {
                              r_idx: reservation.id,
                              r_date: reservation.date.toISOString(),
                              b_name: reservation.store,
                              ps_name: reservation.programName,
                              review_items: [
                                { rs_idx: "1", rs_type: "시술만족도" },
                                { rs_idx: "2", rs_type: "친절도" },
                                { rs_idx: "3", rs_type: "청결도" },
                              ],
                            },
                          },
                        )
                      }}
                    >
                      만족도 작성
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-b text-16px">
                  {reservation.programName}
                </span>
                <span className="text-gray-600 text-14px">
                  {reservation.date.toLocaleDateString()} {reservation.duration}
                  분 ({reservation.visit}회차)
                </span>
              </div>
            </div>
          </div>
        )),
      )}
      <div ref={observerTarget} className="h-4" />
      {isFetchingNextPage && <LoadingIndicator className="min-h-[100px]" />}
    </div>
  )
}

export default ReservationHistoryPage
