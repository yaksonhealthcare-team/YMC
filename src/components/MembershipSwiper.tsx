import { Box, RadioGroup } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { MembershipRadioCard } from "../pages/reservation/_fragments/MembershipRadioCard"
import { useMemo, useEffect, useState } from "react"
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
  const [activeIndex, setActiveIndex] = useState(0)

  // initialMembershipId 변경 시 로그 출력
  useEffect(() => {
    if (initialMembershipId) {
      console.log(
        `MembershipSwiper: initialMembershipId is set to ${initialMembershipId}`,
      )
    }
  }, [initialMembershipId])

  // 정렬된 멤버십 목록 - initialMembershipId에 따라 재정렬
  const sortedMemberships = useMemo(() => {
    // 정렬할 필요가 없는 경우
    if (!initialMembershipId || membershipsData.body.length <= 1) {
      console.log("MembershipSwiper: No sorting needed")
      return membershipsData.body
    }

    // 선택된 회원권 찾기
    const selectedIndex = membershipsData.body.findIndex(
      (membership) => membership.mp_idx === initialMembershipId,
    )

    // 해당 회원권이 목록에 없으면 원래 목록 반환
    if (selectedIndex === -1) {
      console.log(
        `MembershipSwiper: Membership with ID ${initialMembershipId} not found in list`,
      )
      return membershipsData.body
    }

    // 선택된 회원권을 맨 앞으로 이동
    const result = [...membershipsData.body]
    const selectedMembership = result.splice(selectedIndex, 1)[0]

    console.log(
      `MembershipSwiper: Moved membership ${initialMembershipId} to front of list`,
    )
    return [selectedMembership, ...result]
  }, [membershipsData.body, initialMembershipId])

  // 초기 인덱스 - 항상 0번 인덱스 사용 (정렬된 목록의 첫 번째 항목)
  const initialIndex = useMemo(() => {
    // 정렬된 목록에서는 선택된 회원권이 항상 0번 인덱스
    if (initialMembershipId && sortedMemberships.length > 0) {
      if (sortedMemberships[0].mp_idx === initialMembershipId) {
        console.log("MembershipSwiper: Selected membership is at index 0")
        return 0
      }

      // 혹시 정렬이 제대로 안된 경우를 위한 예비 로직
      const index = sortedMemberships.findIndex(
        (membership) => membership.mp_idx === initialMembershipId,
      )

      if (index !== -1) {
        console.log(
          `MembershipSwiper: Selected membership found at index ${index}`,
        )
        return index
      }
    }
    return 0
  }, [initialMembershipId, sortedMemberships])

  return (
    <Box className="w-full">
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
          initialSlide={initialIndex}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {sortedMemberships.map((membership) => (
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

      {/* 커스텀 페이지네이션 인디케이터 */}
      {sortedMemberships.length > 1 && (
        <div className="flex justify-center mt-4">
          {sortedMemberships.map((_, index) => (
            <div
              key={index}
              className={`w-[6px] h-[6px] mx-[4px] rounded-full ${
                index === activeIndex
                  ? "bg-[#F37165]"
                  : "border border-[#DDDDDD] bg-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </Box>
  )
}
