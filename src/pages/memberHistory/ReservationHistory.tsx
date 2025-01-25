import MainTabs from "./_fragments/MainTabs"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { ReserveCard } from "@components/ReserveCard"
import { useNavigate } from "react-router-dom"
import ReservationIcon from "@assets/icons/ReservationIcon.png"
import { useLayout } from "contexts/LayoutContext"
import { useReservations } from "queries/useReservationQueries"
import { FilterItem, reservationFilters } from "types/Reservation"
import LoadingIndicator from "@components/LoadingIndicator"

const ReservationContent = ({ filterId }: { filterId: string }) => {
  const { data: reservations, isLoading } = useReservations(filterId)

  if (isLoading) {
    return <LoadingIndicator className="flex-1" />
  }

  return (
    <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
      {!reservations || reservations.length === 0 ? (
        <div className="flex justify-center items-center p-4">
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
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
  )
}

const FilterContent = ({ 
  reservationFilter, 
  onFilterChange 
}: { 
  reservationFilter: FilterItem
  onFilterChange: (filter: FilterItem) => void
}) => {
  return (
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
            onClick={() => onFilterChange(filter)}
          >
            {filter.title}
          </Button>
        )
      })}
    </div>
  )
}

const ReservationHistory = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [reservationFilter, setReservationFilter] = useState<FilterItem>(
    reservationFilters[0],
  )

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

      <FilterContent 
        reservationFilter={reservationFilter} 
        onFilterChange={handleFilterChange} 
      />

      <ReservationContent filterId={reservationFilter.id} />

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
