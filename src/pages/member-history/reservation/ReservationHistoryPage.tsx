import MainTabs from "../_fragments/MainTabs"
import { useCallback, useEffect, useRef } from "react"
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
} from "types/Reservation"
import LoadingIndicator from "@components/LoadingIndicator"
import { useReservationStore } from "stores/reservationStore"
import { useQueryClient } from "@tanstack/react-query"
import { createUserContextQueryKey } from "../../../queries/queryKeyFactory"

const ReservationContent = ({
  filterId,
}: {
  filterId: ReservationStatusCode
}) => {
  const queryClient = useQueryClient()
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useReservations(filterId)
  const reservations = data?.pages.flatMap((page) => page.reservations) || []
  const bottomRef = useRef<HTMLDivElement>(null)

  // 탭 전환하거나 페이지에 포커스가 올 때 데이터 리프레시
  useEffect(() => {
    refetch()
  }, [filterId, refetch])

  // 페이지가 마운트되거나 포커스될 때 데이터 리프레시
  useEffect(() => {
    const handleFocus = () => {
      refetch()
    }

    window.addEventListener("focus", handleFocus)
    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [refetch])

  // 주기적으로 데이터 리프레시 (옵션)
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: createUserContextQueryKey(["reservations", filterId]),
      })
    }, 30000) // 30초마다 refresh

    return () => clearInterval(interval)
  }, [filterId, queryClient])

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
    <div
      className="flex-1 pb-32 overflow-auto"
      key={`reservation-content-${filterId}`}
    >
      <div className="px-5">
        {reservations.map((reservation) => (
          <div className="py-[6px]" key={reservation.id}>
            <ReserveCard reservation={reservation} />
          </div>
        ))}

        <div ref={bottomRef} className="h-4 py-2">
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <LoadingIndicator className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
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
    <div className="px-5 py-[16px] flex justify-center gap-2">
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
  const {
    filter: reservationFilter,
    setFilter: setReservationFilter,
    resetFilter,
  } = useReservationStore()

  const handleFilterChange = useCallback(
    (filter: FilterItem) => {
      setReservationFilter(filter)
    },
    [setReservationFilter],
  )

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

  useEffect(() => {
    return () => {
      resetFilter()
    }
  }, [resetFilter])

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
        className="fixed bottom-[98px] right-5 w-14 h-14 bg-primary-300 text-white rounded-full shadow-lg hover:bg-primary-400  transition-colors duration-200 z-10"
        onClick={handleReservationClick}
      >
        <ReservationIcon className="w-8 h-8 mx-auto text-white" />
      </button>
    </div>
  )
}

export default ReservationHistoryPage
