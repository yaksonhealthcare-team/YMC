import { useNavigate } from 'react-router-dom';
import { Title } from '@components/Title';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEvents } from 'queries/useEventQueries';
import { Event } from 'types/Event';
import { formatDate } from 'utils/date';

export const EventSection = () => {
  const { data: events } = useEvents('ING');
  const navigate = useNavigate();

  const formatDateForAPI = (date: Date) => {
    return formatDate(date, 'YYYY-MM-DD');
  };

  return (
    events &&
    events.length > 0 && (
      <div className="mt-6 px-5">
        <Title title="이벤트 프로모션" />
        <Swiper
          spaceBetween={10}
          slidesPerView={events.length === 1 ? 1 : 1.1}
          style={{ overflow: 'visible' }}
          className="mt-2"
        >
          {events.map((event: Event) => (
            <SwiperSlide key={event.code} className={events.length === 1 ? '' : 'mr-3'}>
              <div
                className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
                onClick={() => navigate(`/event/${event.code}`)}
              >
                {event.files.length > 0 && (
                  <div className="w-full aspect-[16/9] relative rounded-t-[20px] overflow-hidden">
                    <img
                      src={event.thumbnail.fileurl}
                      alt={event.title}
                      className="w-full h-full object-cover object-top absolute inset-0"
                    />
                  </div>
                )}
                <div className="flex flex-col px-5 gap-1.5">
                  <span className="font-b text-16px text-gray-700">{event.title}</span>
                  <span className="font-r text-12px text-gray-600">
                    {formatDateForAPI(new Date(event.sdate))} ~ {formatDateForAPI(new Date(event.edate))}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
};
