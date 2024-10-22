import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import SettingIcon from "@assets/icons/SettingIcon.svg?react"
import { Filter } from "@components/Filter.tsx"
import { NotificationCard } from "@components/NotificationCard.tsx"
import { Container } from "@mui/material"

const filters = [
  { label: "전체", type: "default" },
  { label: "예약", type: "default" },
  { label: "회원권", type: "default" },
  { label: "포인트", type: "default" },
  { label: "공지", type: "default" },
]
const reserveCardsData: Array<{
  read?: boolean
  store: string
  title: string
  date: string
  time: string
  reserveTitle: string
  reserveDate: string
  onClick?: () => void
}> = [
  {
    store: "약손명가 강남구청역점",
    title: "전신관리 120분",
    date: "7월 12일 (토)",
    time: "오전 11:00",
    reserveTitle: "예약완료",
    reserveDate: "07. 12 오전 10:12",
  },
  {
    read: true,
    store: "약손명가 강남구청역점",
    title: "전신관리 120분",
    date: "7월 12일 (토)",
    time: "오전 11:00",
    reserveTitle: "예약취소",
    reserveDate: "07. 12 오전 10:12",
  },
]

export const Notification = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "알림",
      right: (
        <div onClick={() => navigate("/mypage/alarm")}>
          <SettingIcon className="w-6 h-6" />
        </div>
      ),
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
    })
    setNavigation({ display: true })
  }, [])

  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState<string>("전체") // 초기값을 "전체"로 설정

  const handleFilterClick = (label: string) => {
    setActiveFilter(label) // 클릭된 필터의 label을 active로 설정
  }

  return (
    <Container className={"relative w-full bg-system-bg py-4 h-full"}>
      <div className="py-4 px-5 flex gap-2 justify-center">
        {filters.map((filter) => (
          <Filter
            key={filter.label}
            label={filter.label}
            type={filter.type as "default" | "arrow" | "reload"}
            state={activeFilter === filter.label ? "active" : "default"}
            onClick={() => handleFilterClick(filter.label)}
          />
        ))}
      </div>
      {reserveCardsData.map((data) => (
        <NotificationCard {...data} className="mt-4" />
      ))}
    </Container>
  )
}
