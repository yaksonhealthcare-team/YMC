import { useParams } from "react-router-dom"
import { useEventDetail } from "queries/useEventQueries"
import { EmptyCard } from "@components/EmptyCard"
import { useLayout } from "contexts/LayoutContext"
import { useEffect } from "react"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import LoadingIndicator from "@components/LoadingIndicator"
import { EventDetail } from "types/Event"
import { sanitizeHtml } from "utils/sanitize"
import { Image } from "@components/common/Image"

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading, isError } = useEventDetail(id!)
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  if (isError || !event) {
    return (
      <EmptyCard
        title={`이벤트 정보를 불러올 수 없어요.\n잠시 후 다시 시도해주세요.`}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="flex flex-col gap-6 mt-[48px]">
        <EventHeader event={event} />
        <div className="w-full h-[1px] bg-[#ECECEC] rounded-[1px]"></div>
        <EventContent event={event} />
      </div>
    </div>
  )
}

const EventHeader = ({ event }: { event: EventDetail }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-18px font-bold text-gray-900">{event.title}</div>
      <div className="flex items-center gap-2">
        <CalendarIcon className={"w-[14px] h-[14px]"} />
        <div className="text-14px font-medium text-gray-500">
          {event.sdate} ~ {event.edate}
        </div>
      </div>
    </div>
  )
}

const EventContent = ({ event }: { event: EventDetail }) => {
  if (!event.contents) {
    return null
  }

  return (
    <div className="self-stretch flex flex-col gap-3">
      {event.files?.length > 0 && event.files[0].fileurl && (
        <div className="relative w-full h-[200px] md:h-[400px]">
          <Image
            src={event.files[0].fileurl}
            alt={event.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
      <div
        className="text-16px font-normal text-gray-900 leading-[26.88px]"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.contents) }}
      />
    </div>
  )
}

export default EventDetailPage
