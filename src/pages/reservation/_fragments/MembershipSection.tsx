import { MembershipSwiper } from "@components/MembershipSwiper"
import { MembershipItem } from "types/Membership"
import { HTTPResponse } from "types/HTTPResponse"
import { RadioCard } from "@components/RadioCard"
import { RadioGroup } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { getConsultationCount } from "apis/reservation.api"

interface MembershipSectionProps {
  membershipsResponse: HTTPResponse<MembershipItem[]>
  selectedItem: string | undefined
  onChangeItem: (item: string) => void
}

export const MembershipSection = ({
  membershipsResponse,
  selectedItem,
  onChangeItem,
}: MembershipSectionProps) => {
  const { data: consultationCount = 0 } = useQuery({
    queryKey: ["consultationCount"],
    queryFn: getConsultationCount,
  })

  return (
    <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
      <p className="font-m text-14px text-gray-700 mb-4">회원권 선택</p>
      <RadioGroup
        className="flex flex-col space-y-4"
        value={selectedItem}
        onChange={(e) => onChangeItem(e.target.value)}
      >
        <div>
          <RadioCard checked={selectedItem === "상담 예약"} value="상담 예약">
            <div className="justify-start items-center gap-2 flex">
              <div className="text-gray-700 text-16px font-sb">상담 예약</div>
              <div className="px-2 py-0.5 bg-tag-greenBg rounded-[999px] justify-center items-center flex">
                <div className="text-center text-tag-green text-12px font-m">
                  {consultationCount === 0 ? "FREE" : `${consultationCount}/2`}
                </div>
              </div>
            </div>
          </RadioCard>
        </div>

        {/* 회원권 스와이퍼 */}
        <MembershipSwiper
          membershipsData={{
            ...membershipsResponse,
            body: membershipsResponse.body.filter(
              (item) => item.s_idx !== "상담 예약",
            ),
          }}
          selectedItem={selectedItem}
          onChangeItem={onChangeItem}
        />
      </RadioGroup>
    </section>
  )
}
