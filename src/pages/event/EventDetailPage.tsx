import { useParams } from "react-router-dom"
import { useEventDetail } from "queries/useEventQueries"
import { Swiper, SwiperSlide } from "swiper/react"
import { EmptyCard } from "@components/EmptyCard"

const EventDetailPage = () => {
  const { code } = useParams<{ code: string }>()
  const { data: event } = useEventDetail(code!)

  if (!event) {
    return (
      <EmptyCard
        title={`이벤트 정보를 불러올 수 없어요.\n잠시 후 다시 시도해주세요.`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-[100px]">
      {event.files.length > 0 && (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {event.files.map(({ fileurl }, index) => (
            <SwiperSlide key={index} className="mr-3">
              <div
                style={{ backgroundImage: `url(${fileurl})` }}
                className="w-full h-[190px] bg-cover bg-center rounded-[20px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
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
