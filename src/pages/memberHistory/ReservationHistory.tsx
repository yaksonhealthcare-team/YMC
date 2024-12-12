import MainTabs from "./_fragments/MainTabs"
import { useEffect, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { ReserveCard } from "@components/ReserveCard"
import { useNavigate } from "react-router-dom"
import ReservationIcon from "@assets/icons/ReservationIcon.png"
import { useLayout } from "contexts/LayoutContext"

interface FilterItem {
  id: string
  title: string
}

const defaultFilter: FilterItem = {
  id: "all",
  title: "전체",
}

export type FilterItems = FilterItem[]

const ReservationHistory = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [reservationFilter, setReservationFilter] =
    useState<FilterItem>(defaultFilter)
  const [filteredReservations, _setFilteredReservations] = useState()

  const handleOnClickFloatingButton = () => {
    navigate("/reservation/form")
  }

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation])

  return (
    <div className="flex flex-col bg-system-bg min-h-[calc(100vh-82px)]">
      <div className="px-5">
        <MainTabs />
      </div>

      <div className="px-5 py-4 flex justify-center gap-2">
        {/* {reservationFilters.map((filter) => {
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
              onClick={() => setReservationFilter(filter)}
            >
              {filter.title}
            </Button>
          )
        })} */}
      </div>

      <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
        <div className="space-y-3">
          {/* {filteredReservations.map((item, index) => (
            <ReserveCard
              key={index}
              id={item.id}
              status={item.status}
              store={item.store}
              title={item.title}
              count={item.count}
              date={item.date}
            />
          ))} */}
        </div>
      </div>
      <button
        className="fixed bottom-[98px] right-5 w-14 h-14 bg-primary-300 text-white rounded-full shadow-lg hover:bg-primary-400 focus:outline-none focus:bg-primary-500 focus:ring-opacity-50 transition-colors duration-200 z-10"
        onClick={handleOnClickFloatingButton}
      >
        <img src={ReservationIcon} alt="예약하기" className="w-8 h-8 mx-auto" />
      </button>
    </div>
  )
}

export default ReservationHistory
