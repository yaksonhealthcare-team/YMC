import { useNoticesSummary } from '@/queries/useContentQueries';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface NoticesSummarySliderProps {
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  fromPath?: string;
}

const NoticesSummarySlider = ({ className, left, right, fromPath = '/' }: NoticesSummarySliderProps) => {
  const navigate = useNavigate();
  const { data: noticesData } = useNoticesSummary();

  if (!noticesData?.notices?.length) return null;

  return (
    <div className={className}>
      <Swiper
        className="h-full m-0 w-full overflow-hidden"
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop
        direction="vertical"
        slidesPerView={1}
        autoHeight
      >
        {noticesData.notices.map((notice) => (
          <SwiperSlide
            key={notice.code}
            className="flex text-sm items-center cursor-pointer"
            onClick={() => navigate(`/notice/${notice.code}`, { state: { from: fromPath } })}
          >
            {left}
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{notice.title}</span>
            {right}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NoticesSummarySlider;
