import { useNavigate } from "react-router-dom"
import { useEvents } from "queries/useEventQueries"
import { Event, Tab } from "types/Event"
import { useState, useLayoutEffect } from "react"
import { EmptyCard } from "@components/EmptyCard"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import Header from "@components/Header"
import clsx from "clsx"
import { useLayout } from "../../contexts/LayoutContext"
import { Image } from "@components/common/Image"

const EventPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<Tab>("ALL")
  const { data: events, isLoading } = useEvents(selectedTab)
  const { setNavigation, setHeader } = useLayout()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    setHeader({
      backgroundColor: "bg-white",
    })
    setNavigation({ display: true })
  }, [setNavigation, setHeader])

  return (
    <div className="absolute inset-0 flex flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white">
        <Header
          type="back_title"
          title="이벤트"
          onClickBack={() => navigate(-1)}
        />
        <div className="flex px-5">
          <button
            onClick={() => setSelectedTab("ALL")}
            className="focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded"
            aria-label="전체 이벤트"
          >
            전체
          </button>
          <button
            onClick={() => setSelectedTab("ING")}
            className="focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded"
            aria-label="진행중인 이벤트"
          >
            진행중
          </button>
          <button
            onClick={() => setSelectedTab("END")}
            className="focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded"
            aria-label="종료된 이벤트"
          >
            종료
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative">
        {isLoading ? (
          <LoadingIndicator className="absolute inset-0" />
        ) : events && events.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-100">
            {events.map((event: Event) => (
              <div
                key={event.code}
                className="bg-white p-5"
                onClick={() => navigate(`/event/${event.code}`)}
              >
                <div className="flex gap-4">
                  {event.files.length > 0 && (
                    <Image
                      src={event.files[0].fileurl}
                      alt={event.title}
                      className="w-[88px] h-[88px] rounded-lg border border-gray-100 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="font-b text-16px text-gray-900 line-clamp-2">
                      {event.title}
                    </span>
                    <span className="mt-2 font-r text-12px text-gray-500">
                      {event.sdate} ~ {event.edate}
                    </span>
                  </div>
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
