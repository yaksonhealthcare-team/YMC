import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Autoplay } from "swiper/modules"
import { useNoticesSummary } from "../queries/useContentQueries.tsx"
import React from "react"
import { useNavigate } from "react-router-dom"
import { Notice } from "../types/Content.ts"
import { Swiper as SwiperType } from "swiper"

const ITEM_CHANGE_DELAY = 3000

interface NoticesSummarySliderProps {
  className?: string
  left?: React.ReactNode
  right?: React.ReactNode
}

const NoticesSummarySlider = ({
  className,
  left,
  right,
}: NoticesSummarySliderProps) => {
  const navigate = useNavigate()
  const { data: notices } = useNoticesSummary()

  const handleSlideClick = (notice: Notice) => {
    navigate(`/notice/${notice.code}`)
  }

  return (
    <div className={className}>
      {notices && notices.length > 0 && (
        <Swiper
          className="h-full m-0 w-full overflow-hidden"
          modules={[Autoplay]}
          autoplay={{
            delay: ITEM_CHANGE_DELAY,
            disableOnInteraction: false,
          }}
          loop={true}
          direction="vertical"
          slidesPerView={1}
          autoHeight={true}
        >
          {notices.map((notice, index) => (
            <SwiperSlide
              key={index}
              className={`flex text-sm items-center cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation()
                handleSlideClick(notice)
              }}
            >
              {left}
              <span
                className={`overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                {notice.title}
              </span>
              {right}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default NoticesSummarySlider
