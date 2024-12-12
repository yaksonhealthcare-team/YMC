import MainTabs from "./_fragments/MainTabs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { ReserveCard } from "@components/ReserveCard"
import { useNavigate } from "react-router-dom"
import ReservationIcon from "@assets/icons/ReservationIcon.png"
import { useLayout } from "contexts/LayoutContext"
import { useReservations } from "queries/useReservationQueries"
import { FilterItem, reservationFilters } from "types/Reservation"
import SplashScreen from "@components/Splash"

const ReservationHistory = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [reservationFilter, setReservationFilter] = useState<FilterItem>(
    reservationFilters[0],
  )

  const { data: reservations, isLoading } = useReservations(
    reservationFilter.id,
  )

  const flattenedReservations = useMemo(() => {
    if (!reservations?.pages) return []
    return reservations.pages.flatMap((page) => page)
  }, [reservations])

  const handleFilterChange = useCallback((filter: FilterItem) => {
    setReservationFilter(filter)
  }, [])

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [])

  return (
    <div className="flex flex-col bg-system-bg min-h-[calc(100vh-82px)]">
      <div className="px-5">
        <MainTabs />
      </div>
      {isLoading && <SplashScreen />}

      <div className="px-5 py-4 flex justify-center gap-2">
        {reservationFilters.map((filter) => {
          const isSelected = filter.id === reservationFilter.id
          return (
            <Button
              key={filter.id}
              fullCustom
              className={clsx(
                "min-w-0 whitespace-nowrap px-[12px] py-[5px] text-12px font-sb !rounded-2xl",
                isSelected
                  ? "bg-primary-50 text-primary border border-solid border-primary"
                  : "bg-white text-gray-500 border border-solid border-gray-200",
              )}
              onClick={() => handleFilterChange(filter)}
            >
              {filter.title}
            </Button>
          )
        })}
      </div>

      <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
        {flattenedReservations.length === 0 ? (
          <div className="flex justify-center items-center p-4">
            예약 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {flattenedReservations.map((reservation) => (
              <ReserveCard
                key={reservation.id}
                id={reservation.id}
                status={reservation.status}
                store={reservation.store}
                title={reservation.programName}
                count={reservation.visit}
                date={reservation.date}
              />
            ))}
          </div>
        )}
      </div>

      <button
        className="fixed bottom-[98px] right-5 w-14 h-14 bg-primary-300 text-white rounded-full shadow-lg hover:bg-primary-400 focus:outline-none focus:bg-primary-500 focus:ring-opacity-50 transition-colors duration-200 z-10"
        onClick={() => navigate("/reservation/form")}
      >
        <img src={ReservationIcon} alt="예약하기" className="w-8 h-8 mx-auto" />
      </button>
    </div>
  )
}

export default ReservationHistory
