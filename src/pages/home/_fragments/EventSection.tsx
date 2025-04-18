import { useNavigate } from "react-router-dom"
import { Title } from "@components/Title"
import { Swiper, SwiperSlide } from "swiper/react"
import { EmptyCard } from "@components/EmptyCard"
import { useEvents } from "queries/useEventQueries"
import { Event } from "types/Event"
import { formatDate } from "utils/date"

export const EventSection = () => {
  const { data: events } = useEvents("ING")
  const navigate = useNavigate()

  const formatDateForAPI = (date: Date) => {
    return formatDate(date, "YYYY-MM-DD")
  }

  return (
    <div className="mt-6 px-5">
      <Title title="이벤트 프로모션" />
      {events && events.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={events.length === 1 ? 1 : 1.1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {events.map((event: Event) => (
            <SwiperSlide
              key={event.code}
              className={events.length === 1 ? "" : "mr-3"}
            >
              <div
                className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
                onClick={() => navigate(`/event/${event.code}`)}
              >
                {event.files.length > 0 && (
                  <div className="w-full aspect-[16/9] relative rounded-t-[20px] overflow-hidden">
                    <img
                      src={event.files[0].fileurl}
                      alt={event.title}
                      className="w-full h-full object-cover object-top absolute inset-0"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-col px-5 gap-1.5">
                  <span className="font-b text-16px text-gray-700">
                    {event.title}
                  </span>
                  <span className="font-r text-12px text-gray-600">
                    {formatDateForAPI(new Date(event.sdate))} ~{" "}
                    {formatDateForAPI(new Date(event.edate))}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`진행중인 이벤트가 없어요.\n새로운 이벤트로 곧 찾아뵐게요.`}
        />
      )}
    </div>
  )
}
