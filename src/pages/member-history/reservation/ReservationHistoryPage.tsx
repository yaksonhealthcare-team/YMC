import MainTabs from "../_fragments/MainTabs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { ReserveCard } from "@components/ReserveCard"
import { useNavigate } from "react-router-dom"
import ReservationIcon from "@assets/icons/ReservationIcon.svg?react"
import { useLayout } from "contexts/LayoutContext"
import { useReservations } from "queries/useReservationQueries"
import {
  FilterItem,
  reservationFilters,
  ReservationStatusCode,
  Reservation,
} from "types/Reservation"
import LoadingIndicator from "@components/LoadingIndicator"

const ReservationContent = ({
  filterId,
}: {
  filterId: ReservationStatusCode
}) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useReservations(filterId)
  const reservations = data?.pages.flat() || []
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 },
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  if (isLoading) {
    return <LoadingIndicator className="flex-1" />
  }

  if (reservations.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        예약 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide" key={`reservation-content-${filterId}`}>
      <div className="space-y-3">
        {reservations.map((reservation: Reservation) => (
          <ReserveCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
      <div ref={bottomRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingIndicator className="w-6 h-6" />
        </div>
      )}
    </div>
  )
}

const FilterContent = ({
  reservationFilter,
  onFilterChange,
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
              "min-w-0 whitespace-nowrap px-[12px] py-[5px] text-14px !rounded-[15px]",
              isSelected
                ? "bg-primary-50 text-primary border border-solid border-primary font-sb"
                : "bg-white text-gray-500 border border-solid border-gray-200 font-r",
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

const ReservationHistoryPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [reservationFilter, setReservationFilter] = useState<FilterItem>(
    reservationFilters[1],
  )

  const handleFilterChange = useCallback((filter: FilterItem) => {
    setReservationFilter(filter)
  }, [])

  const handleReservationClick = () => {
    navigate("/reservation/form", {
      state: {
        originalPath: "/member-history/reservation",
        fromReservationHistory: true,
      },
    })
  }

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
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
        onClick={handleReservationClick}
      >
        <ReservationIcon className="w-8 h-8 mx-auto text-white" />
      </button>
    </div>
  )
}

export default ReservationHistoryPage
