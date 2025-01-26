import { useParams } from "react-router-dom"
import { useEventDetail } from "queries/useEventQueries"
import { Swiper, SwiperSlide } from "swiper/react"
import { EmptyCard } from "@components/EmptyCard"
import { useLayout } from "contexts/LayoutContext"
import { useEffect } from "react"

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  console.log("Event ID:", id)
  const { data: event } = useEventDetail(id!)
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: event?.title || "이벤트",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, event?.title])

  if (!event) {
    return (
      <EmptyCard
        title={`이벤트 정보를 불러올 수 없어요.\n잠시 후 다시 시도해주세요.`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-[100px] pt-4 mx-auto w-full max-w-[768px]">
      {event.files.length > 0 && (
        <div className="px-5">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            style={{ overflow: "visible" }}
          >
            {event.files.map(({ fileurl }, index) => (
              <SwiperSlide key={index}>
                <img
                  src={fileurl}
                  alt={event.title}
                  className="w-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="flex flex-col px-5 gap-1.5">
        <span className="font-b text-20px text-gray-700">{event.title}</span>
        <span className="font-r text-14px text-gray-600">
          {event.sdate} ~ {event.edate}
        </span>
      </div>

      <div
        className="px-5 font-r text-14px text-gray-700"
        dangerouslySetInnerHTML={{ __html: event.contents }}
      />
    </div>
  )
}

export default EventDetailPage
