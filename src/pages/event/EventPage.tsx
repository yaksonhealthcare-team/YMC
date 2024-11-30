import React, { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import EventItem from "./_fragments/EventItem.tsx"
import { EventStatus } from "../../types/Content.ts"
import { useEvents } from "../../queries/useContentQueries.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"

type Tab = Exclude<EventStatus, "TBD">

const EventPage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const [selectedTab, setSelectedTab] = useState<Tab>("ALL")

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEvents(selectedTab)
  const events = (pages?.pages || []).flatMap((page) => page)
  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "이벤트",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab)
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex justify-center space-x-4 px-5">
        <div
          className={`flex-1 pb-3 text-center ${selectedTab === "ALL" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("ALL")}
        >
          전체
        </div>
        <div
          className={`flex-1 pb-3 text-center ${selectedTab === "ING" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("ING")}
        >
          진행중
        </div>
        <div
          className={`flex-1 pb-3 text-center ${selectedTab === "END" ? "border-b-2 border-primary text-primary" : "text-gray-700"}`}
          onClick={() => handleTabClick("END")}
        >
          종료
        </div>
      </div>

      {events.length === 0 ? (
        <div className={"w-full text-center mt-20"}>{"이벤트가 없습니다."}</div>
      ) : (
        <ul className="overflow-y-scroll h-full px-5 py-2 divide-y divide-gray-100">
          {events.map((event) => (
            <li key={event.code}>
              <EventItem event={event} />
            </li>
          ))}
          <div ref={observerTarget} className={"h-1"} />
        </ul>
      )}
    </div>
  )
}

export default EventPage
