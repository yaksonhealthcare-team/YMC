import { useNavigate } from "react-router-dom"
import { useEvents } from "queries/useEventQueries"
import { Event, Tab } from "types/Event"
import { useState, useLayoutEffect } from "react"
import { EmptyCard } from "@components/EmptyCard"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import Header from "@components/Header"
import clsx from "clsx"

const EventPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<Tab>("ALL")
  const { data: events, isLoading } = useEvents()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }, [])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white">
        <Header type="back_title" title="이벤트" onClickBack={() => navigate(-1)} />
        <div className="flex px-5">
          <button
            className={clsx(
              "flex-1 py-3 font-sb text-16px relative",
              selectedTab === "ALL"
                ? "text-primary"
                : "text-gray-700"
            )}
            onClick={() => setSelectedTab("ALL")}
          >
            전체
            {selectedTab === "ALL" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            className={clsx(
              "flex-1 py-3 font-sb text-16px relative",
              selectedTab === "ONGOING"
                ? "text-primary"
                : "text-gray-700"
            )}
            onClick={() => setSelectedTab("ONGOING")}
          >
            진행중
            {selectedTab === "ONGOING" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            className={clsx(
              "flex-1 py-3 font-sb text-16px relative",
              selectedTab === "ENDED"
                ? "text-primary"
                : "text-gray-700"
            )}
            onClick={() => setSelectedTab("ENDED")}
          >
            종료
            {selectedTab === "ENDED" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {events && events.length > 0 ? (
          <div className="flex flex-col gap-3 px-5 py-4 pb-[100px]">
            {events.map((event: Event) => (
              <div
                key={event.code}
                className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
                onClick={() => navigate(`/event/${event.code}`)}
              >
                {event.files.length > 0 && (
                  <div
                    style={{ backgroundImage: `url(${event.files[0].fileurl})` }}
                    className="w-full h-[190px] bg-cover bg-center rounded-t-[20px]"
                  ></div>
                )}
                <div className="flex flex-col px-5 gap-1.5">
                  <span className="font-b text-16px text-gray-700">
                    {event.title}
                  </span>
                  <span className="font-r text-12px text-gray-600">
                    {event.sdate} ~ {event.edate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCard
            title={`진행중인 이벤트가 없어요.\n새로운 이벤트로 곧 찾아뵐게요.`}
          />
        )}
      </div>
    </div>
  )
}

export default EventPage
