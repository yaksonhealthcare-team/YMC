import React, { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import EventItem from "./_fragments/EventItem.tsx"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  isEnded: boolean
  imageUrl: string
}

const EventPage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedTab, setSelectedTab] = useState<"all" | "ongoing" | "ended">(
    "all",
  )

  useEffect(() => {
    setHeader({
      display: true,
      title: "이벤트",
    })
    setNavigation({ display: true })

    // 이벤트 데이터를 가져오는 로직 추가
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "한줄 이벤트 제목입니다.",
        startDate: "2024.08.24",
        endDate: "2024.08.24",
        isEnded: false,
        imageUrl: "https://via.placeholder.com/88x88",
      },
      // 더 많은 이벤트 데이터
    ]
    setEvents(mockEvents)
  }, [setHeader, setNavigation])

  const handleTabClick = (tab: "all" | "ongoing" | "ended") => {
    setSelectedTab(tab)
  }

  const filteredEvents =
    selectedTab === "all"
      ? events
      : selectedTab === "ongoing"
        ? events.filter((event) => !event.isEnded)
        : events.filter((event) => event.isEnded)

  return (
    <div className="h-screen max-h-full bg-white p-5">
      <div className="flex justify-center space-x-4 py-2">
        <div
          className={`flex-1 py-3 text-center ${selectedTab === "all" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("all")}
        >
          전체
        </div>
        <div
          className={`flex-1 py-3 text-center ${selectedTab === "ongoing" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("ongoing")}
        >
          진행중
        </div>
        <div
          className={`flex-1 py-3 text-center ${selectedTab === "ended" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("ended")}
        >
          종료
        </div>
      </div>
      <div className="space-y-1">
        {filteredEvents.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default EventPage
