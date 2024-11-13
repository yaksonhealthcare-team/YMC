import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { CustomTabs } from "@components/Tabs"
import { Button } from "@components/Button"
import { ReserveCard } from "@components/ReserveCard"
import { MembershipCard } from "@components/MembershipCard"
import { SearchFloatingButton } from "@components/SearchFloatingButton"

type ReservationStatus = "pre" | "ing" | "post"
type MembershipStatus = "default" | "reserve" | "used"

// Extending the exact prop types from ReserveCard component
type ReservationItem = {
  type: ReservationStatus
  store: string
  title: string
  count: number
  date: string
  time: string
  dDay?: number
}

// Extending the exact prop types from MembershipCard component
type MembershipItem = {
  type: MembershipStatus
  title: string
  count: string
  date: string
}

type MemberHistoryTab = "reservation" | "membership"

const mainTabs = [
  { label: "예약", value: "reservation" },
  { label: "회원권", value: "membership" },
]

const reservationFilterItems = [
  { id: "all", title: "전체" },
  { id: "upcoming", title: "방문예정" },
  { id: "completed", title: "방문완료" },
  { id: "canceled", title: "예약취소" },
]

const membershipFilterItems = [
  { id: "all", title: "전체" },
  { id: "available", title: "사용가능" },
  { id: "completed", title: "사용완료" },
  { id: "expired", title: "만료됨" },
]

const MemberHistory = () => {
  const { tab } = useParams<{ tab: MemberHistoryTab }>()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const activeTab = tab || "reservation"
  const [reservationFilter, setReservationFilter] = useState("all")
  const [membershipFilter, setMembershipFilter] = useState("all")

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation])

  const handleOnChangeTab = (value: MemberHistoryTab) => {
    navigate(`/member-history/${value}`)
  }

  const reservations: ReservationItem[] = [
    {
      type: "pre",
      store: "약손명가 강남구청역점",
      title: "전신관리 120분",
      count: 3,
      date: "7월 12일 (토)",
      time: "오전 11:00",
      dDay: 8,
    },
    // ... more reservations
  ]

  const memberships: MembershipItem[] = [
    {
      type: "default",
      title: "K-BEAUTY 연예인관리",
      count: "4회 / 20",
      date: "2024.04.01 - 2024.12.31",
    },
    // ... more memberships
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5F2]">
      {/* Main Tabs */}
      <div className="px-5">
        <CustomTabs
          type="1depth"
          tabs={mainTabs}
          onChange={(value) => handleOnChangeTab(value as MemberHistoryTab)}
          activeTab={activeTab}
        />
      </div>

      {/* Filters */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {(activeTab === "reservation"
          ? reservationFilterItems
          : membershipFilterItems
        ).map((filter) => (
          <Button
            key={filter.id}
            variantType={"line"}
            sizeType="s"
            onClick={() =>
              activeTab === "reservation"
                ? setReservationFilter(filter.id)
                : setMembershipFilter(filter.id)
            }
            className={`whitespace-nowrap !min-w-fit !px-[12px] !h-8 !rounded-full
                ${
                  filter.id ===
                  (activeTab === "reservation"
                    ? reservationFilter
                    : membershipFilter)
                    ? "!text-primary-300 !bg-tag-redBg !border-primary-300"
                    : "!text-gray-500 !border-gray-200 !font-normal"
                }`}
          >
            {filter.title}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 space-y-3 pb-32">
        {activeTab === "reservation" ? (
          <div className="space-y-3">
            {reservations.map((item, index) => (
              <ReserveCard
                key={index}
                type={item.type}
                store={item.store}
                title={item.title}
                count={item.count}
                date={item.date}
                time={item.time}
                dDay={item.dDay}
                onClick={() => navigate(`/reservation/${index}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {memberships.map((item, index) => (
              <MembershipCard
                key={index}
                type={item.type}
                title={item.title}
                count={item.count}
                date={item.date}
                onClick={() => navigate(`/membership/${index}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
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
