import { Box, RadioGroup } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { MembershipRadioCard } from "../pages/reservation/_fragments/MembershipRadioCard"
import { useMemo, useState, useEffect, useRef } from "react"
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
  const isInitialRender = useRef(true)
  const [sortedMemberships, setSortedMemberships] = useState<MyMembership[]>([])

  // 처음 로드될 때만 정렬된 회원권 목록 설정
  useEffect(() => {
    if (isInitialRender.current) {
      // 첫 렌더링 시 정렬 적용
      let sorted = [...membershipsData.body]

      // initialMembershipId가 있을 경우에만 정렬 수행
      if (initialMembershipId && membershipsData.body.length > 1) {
        const selectedIndex = membershipsData.body.findIndex(
          (membership) => membership.mp_idx === initialMembershipId,
        )

        if (selectedIndex !== -1) {
          // 선택된 회원권을 맨 앞으로 이동
          const selectedMembership = sorted.splice(selectedIndex, 1)[0]
          sorted = [selectedMembership, ...sorted]
        }
      }

      setSortedMemberships(sorted)
      isInitialRender.current = false
    } else if (membershipsData.body.length !== sortedMemberships.length) {
      // 회원권 개수가 변경된 경우에만 목록 업데이트 (정렬은 유지)
      setSortedMemberships(membershipsData.body)
    }
  }, [membershipsData.body, initialMembershipId, sortedMemberships.length])

  // 초기 인덱스 - 선택된 회원권의 위치 찾기
  const initialIndex = useMemo(() => {
    if (!selectedItem || sortedMemberships.length === 0) return 0

    const index = sortedMemberships.findIndex(
      (membership) => membership.mp_idx === selectedItem,
    )
    return index !== -1 ? index : 0
  }, [selectedItem, sortedMemberships])

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
