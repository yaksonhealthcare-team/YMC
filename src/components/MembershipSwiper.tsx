import { Box, RadioGroup } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { MembershipRadioCard } from "../pages/reservation/_fragments/MembershipRadioCard"
import { useMemo, useEffect } from "react"
import { MyMembership } from "types/Membership"
import { ListResponse } from "apis/membership.api"

interface MembershipSwiperProps {
  membershipsData: ListResponse<MyMembership>
  selectedItem?: string
  onChangeItem: (value: string) => void
  initialMembershipId?: string
}

export const MembershipSwiper = ({
  membershipsData,
  selectedItem,
  onChangeItem,
  initialMembershipId,
}: MembershipSwiperProps) => {
  // 초기 회원권 ID가 있으면 해당 회원권의 인덱스를 찾고 초기 activeIndex로 설정
  const initialIndex = useMemo(() => {
    if (initialMembershipId && membershipsData.body.length > 0) {
      const index = membershipsData.body.findIndex(
        (membership) => membership.mp_idx === initialMembershipId
      )
      return index !== -1 ? index : 0
    }
    return 0
  }, [initialMembershipId, membershipsData.body])
  
  // 회원권 ID가 있고 아직 선택되지 않았으면 해당 회원권 선택
  useEffect(() => {
    if (
      initialMembershipId && 
      !selectedItem && 
      membershipsData.body.length > 0
    ) {
      const membership = membershipsData.body.find(
        (m) => m.mp_idx === initialMembershipId
      )
      
      if (membership) {
        onChangeItem(initialMembershipId)
      }
    }
  }, [initialMembershipId, selectedItem, membershipsData.body, onChangeItem])

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
          initialSlide={initialIndex}
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
