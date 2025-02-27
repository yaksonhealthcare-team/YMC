import { Box, RadioGroup } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { MembershipRadioCard } from "../pages/reservation/_fragments/MembershipRadioCard"
import type { Swiper as SwiperType } from "swiper"
import { useState } from "react"
import { MyMembership } from "types/Membership"
import { ListResponse } from "apis/membership.api"

interface MembershipSwiperProps {
  membershipsData: ListResponse<MyMembership>
  selectedItem?: string
  onChangeItem: (value: string) => void
}

export const MembershipSwiper = ({
  membershipsData,
  selectedItem,
  onChangeItem,
}: MembershipSwiperProps) => {
  // eslint-disable-next-line
  const [_, setSwiperInstance] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <Box className="w-full pb-[20px]">
      <RadioGroup
        value={selectedItem}
        onChange={(e) => onChangeItem(e.target.value)}
      >
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="w-full"
          pagination={{
            clickable: true,
          }}
          onSwiper={setSwiperInstance}
          initialSlide={activeIndex}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          <style>
            {`
              .swiper-pagination {
                bottom: -28px !important;
              }
              .swiper-pagination-bullet {
                width: 6px;
                height: 6px;
                background: #DDDDDD;
                opacity: 1;
              }
              .swiper-pagination-bullet-active {
                background: #F37165;
              }
            `}
          </style>
          {membershipsData.body.map((membership) => (
            <SwiperSlide key={membership.mp_idx}>
              <div>
                <MembershipRadioCard
                  membership={membership}
                  checked={selectedItem === membership.mp_idx}
                  value={membership.mp_idx}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </RadioGroup>
    </Box>
  )
}
