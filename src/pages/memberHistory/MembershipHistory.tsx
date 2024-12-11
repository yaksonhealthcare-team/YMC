import {
  membershipFilters,
  MembershipItem,
  MembershipStatus,
} from "types/Membership"
import MainTabs from "./_fragments/MainTabs"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { MembershipCard } from "@components/MembershipCard"
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

const sampleMemberships: MembershipItem[] = [
  {
    id: 0,
    status: MembershipStatus.AVAILABLE,
    title: "K-BEAUTY 연예인관리",
    count: "4회 / 20",
    startAt: "2024.04.01",
    endAt: "2024.12.31",
  },
  {
    id: 1,
    status: MembershipStatus.COMPLETED,
    title: "바디케어 프로그램",
    count: "0회 / 10",
    startAt: "2024.01.01",
    endAt: "2024.03.31",
  },
  {
    id: 2,
    status: MembershipStatus.EXPIRED,
    title: "럭셔리 스파",
    count: "2회 / 5",
    startAt: "2024.12.01",
    endAt: "2024.02.29",
  },
]

const MembershipHistory = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [membershipFilter, setMembershipFilter] =
    useState<FilterItem>(defaultFilter)
  const [filteredMemberships, setFilteredMemberships] =
    useState(sampleMemberships)

  const handleOnClickFloatingButton = () => {
    navigate("/membership")
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
        {membershipFilters.map((filter) => {
          const isSelected = filter.id === membershipFilter.id

          console.log("isSelected", isSelected)

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
              onClick={() => setMembershipFilter(filter)}
            >
              {filter.title}
            </Button>
          )
        })}
      </div>

      <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
        <div className="space-y-3">
          {filteredMemberships.map((item, index) => (
            <MembershipCard
              id={item.id}
              key={index}
              status={item.status}
              title={item.title}
              count={item.count}
              date={`${item.startAt} - ${item.endAt}`}
              showReserveButton={item.status === MembershipStatus.AVAILABLE}
            />
          ))}
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

export default MembershipHistory
