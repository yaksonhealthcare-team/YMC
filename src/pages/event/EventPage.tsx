import { useNavigate } from "react-router-dom"
import { useEvents } from "queries/useEventQueries"
import { Event, Tab } from "types/Event"
import { useState } from "react"
import { EmptyCard } from "@components/EmptyCard"

const EventPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<Tab>("ALL")
  const { data: events } = useEvents()

  return (
    <div className="flex flex-col gap-6 pb-[100px]">
      <div className="flex gap-2 px-5">
        <button
          className={`flex-1 py-2 rounded-[10px] text-14px font-m ${
            selectedTab === "ALL"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setSelectedTab("ALL")}
        >
          전체
        </button>
        <button
          className={`flex-1 py-2 rounded-[10px] text-14px font-m ${
            selectedTab === "ONGOING"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setSelectedTab("ONGOING")}
        >
          진행중
        </button>
        <button
          className={`flex-1 py-2 rounded-[10px] text-14px font-m ${
            selectedTab === "ENDED"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setSelectedTab("ENDED")}
        >
          종료
        </button>
      </div>

      {events && events.length > 0 ? (
        <div className="flex flex-col gap-3 px-5">
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
  )
}

export default EventPage
