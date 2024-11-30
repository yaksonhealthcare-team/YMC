import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { useEvent } from "../../queries/useContentQueries.tsx"
import { EventDetail } from "../../types/Content"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"

function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { setHeader, setNavigation } = useLayout()

  const { data: event, isLoading } = useEvent(id!)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  if (!event || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen max-h-full bg-white overflow-y-scroll p-5">
      <div className="flex flex-col gap-6">
        <EventHeader event={event} />
        <div className="w-full h-[1px] bg-[#ECECEC] rounded-[1px]"></div>
        <EventImage
          imageUrl={
            "/assets/home_event.png"
            // TODO: replace path to `event.files` and check if event.files exists (event.files && {...})
          }
        />
        <EventDescription event={event} />
      </div>
    </div>
  )
}

export default EventDetailPage

function EventHeader({ event }: { event: EventDetail }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-18px font-bold text-gray-900">{event.title}</div>
      <div className="flex items-center gap-2 text-14px font-medium text-gray-500">
        <CalendarIcon className={"w-[14px] h-[14px]"} />
        <p>
          {event.sdate} ~ {event.edate}
        </p>
      </div>
    </div>
  )
}

function EventImage({ imageUrl }: { imageUrl: string }) {
  return (
    <img
      src={imageUrl}
      alt={"이벤트 이미지"}
      className="w-full h-auto rounded-[8px]"
    />
  )
}

function EventDescription({ event }: { event: EventDetail }) {
  return (
    <div className="self-stretch flex flex-col gap-3">
      <div className="text-16px font-normal text-gray-900 leading-[26.88px] whitespace-pre-wrap">
        {event.contents}
      </div>
    </div>
  )
}
