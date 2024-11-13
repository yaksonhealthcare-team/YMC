import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { CustomTabs } from "@components/Tabs"
import { Button } from "@components/Button"
import { ReserveCard } from "@components/ReserveCard"
import { MembershipCard } from "@components/MembershipCard"
import { SearchFloatingButton } from "@components/SearchFloatingButton"
import {
  membershipFilters,
  MembershipItem,
  MembershipStatus,
} from "types/Membership"
import {
  reservationFilters,
  ReservationItem,
  ReservationStatus,
} from "types/Reservation"

type MemberHistoryTab = "reservation" | "membership"

interface FilterItem {
  id: string
  title: string
}

const defaultFilter: FilterItem = {
  id: "all",
  title: "전체",
}

export type FilterItems = FilterItem[]

const mainTabs = [
  { label: "예약", value: "reservation" },
  { label: "회원권", value: "membership" },
]

// 샘플 데이터
const sampleReservations: ReservationItem[] = [
  {
    store: "약손명가 강남점",
    title: "전신관리 90분",
    count: 2,
    date: "2024.07.05",
    time: "오전 10:00",
    status: ReservationStatus.IN_PROGRESS,
  },
  {
    store: "약손명가 강남구청역점",
    title: "전신관리 120분",
    count: 3,
    date: "2024.07.12",
    time: "오전 11:00",
    dDay: 8,
    status: ReservationStatus.UPCOMING,
  },
  {
    store: "약손명가 서초점",
    title: "얼굴관리 60분",
    count: 1,
    date: "2024.07.01",
    time: "오후 2:00",
    status: ReservationStatus.COMPLETED,
  },
  {
    store: "약손명가 강남점",
    title: "전신관리 90분",
    count: 2,
    date: "2024.07.05",
    time: "오전 10:00",
    status: ReservationStatus.CANCELLED,
  },
]

const sampleMemberships: MembershipItem[] = [
  {
    status: MembershipStatus.AVAILABLE,
    title: "K-BEAUTY 연예인관리",
    count: "4회 / 20",
    startAt: "2024.04.01",
    endAt: "2024.12.31",
  },
  {
    status: MembershipStatus.COMPLETED,
    title: "바디케어 프로그램",
    count: "0회 / 10",
    startAt: "2024.01.01",
    endAt: "2024.03.31",
  },
  {
    status: MembershipStatus.EXPIRED,
    title: "럭셔리 스파",
    count: "2회 / 5",
    startAt: "2024.12.01",
    endAt: "2024.02.29",
  },
]

const MemberHistory = () => {
  const { tab } = useParams<{ tab: MemberHistoryTab }>()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const activeTab = tab || "reservation"
  const [reservationFilter, setReservationFilter] =
    useState<FilterItem>(defaultFilter)
  const [membershipFilter, setMembershipFilter] =
    useState<FilterItem>(defaultFilter)
  const [filteredReservations, setFilteredReservations] =
    useState(sampleReservations)
  const [filteredMemberships, setFilteredMemberships] =
    useState(sampleMemberships)

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation])

  useEffect(() => {
    if (reservationFilter.id === "all") {
      setFilteredReservations(sampleReservations)
    } else {
      setFilteredReservations(
        sampleReservations.filter(
          (item) => item.status === reservationFilter.id,
        ),
      )
    }
  }, [reservationFilter])

  useEffect(() => {
    if (membershipFilter.id === "all") {
      setFilteredMemberships(sampleMemberships)
    } else {
      setFilteredMemberships(
        sampleMemberships.filter((item) => item.status === membershipFilter.id),
      )
    }
  }, [membershipFilter])

  const handleOnChangeTab = (value: MemberHistoryTab) => {
    navigate(`/member-history/${value}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5F2]">
      <div className="px-5">
        <CustomTabs
          type="1depth"
          tabs={mainTabs}
          onChange={(value) => handleOnChangeTab(value as MemberHistoryTab)}
          activeTab={activeTab}
        />
      </div>

      <div className="px-5 py-4 flex justify-center gap-2 overflow-x-auto no-scrollbar">
        {(activeTab === "reservation"
          ? reservationFilters
          : membershipFilters
        ).map((filter) => {
          const isSelected =
            filter.id ===
            (activeTab === "reservation"
              ? reservationFilter.id
              : membershipFilter.id)

          return (
            <Button
              key={filter.id}
              variantType="line"
              sizeType="xs"
              onClick={() =>
                activeTab === "reservation"
                  ? setReservationFilter(filter)
                  : setMembershipFilter(filter)
              }
              className={`min-w-0 whitespace-nowrap rounded-full h-[8px] ${
                isSelected
                  ? "bg-primary-50 text-primary border-primary"
                  : "!bg-white !text-gray-500 !border-gray-200"
              }`}
            >
              {filter.title}
            </Button>
          )
        })}
      </div>

      <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto">
        {activeTab === "reservation" ? (
          <div className="space-y-3">
            {filteredReservations.map((item, index) => (
              <ReserveCard
                key={index}
                status={item.status}
                store={item.store}
                title={item.title}
                count={item.count}
                date={item.date}
                time={item.time}
                onClick={() => navigate(`/reservation/${index}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemberships.map((item, index) => (
              <MembershipCard
                key={index}
                status={item.status}
                title={item.title}
                count={item.count}
                date={`${item.startAt} - ${item.endAt}`}
                onClick={() => navigate(`/membership/${index}`)}
                showReserveButton={item.status === MembershipStatus.AVAILABLE}
              />
            ))}
          </div>
        )}
      </div>

      <SearchFloatingButton
        type={activeTab === "reservation" ? "list" : "search"}
        title={activeTab === "reservation" ? "예약내역" : "지점검색"}
        onClick={() => {
          /* handle click */
        }}
      />
    </div>
  )
}

export default MemberHistory
