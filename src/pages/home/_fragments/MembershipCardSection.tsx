import { useNavigate } from "react-router-dom"
import { Title } from "@components/Title"
import { Swiper, SwiperSlide } from "swiper/react"
import { MembershipCard } from "@components/MembershipCard"
import { EmptyCard } from "@components/EmptyCard"
import LoadingIndicator from "@components/LoadingIndicator"
import { MyMembership } from "types/Membership"
import { getStatusFromString } from "utils/membership"

interface MembershipCardSectionProps {
  memberships: MyMembership[]
  isLoading: boolean
}

export const MembershipCardSection = ({
  memberships,
  isLoading,
}: MembershipCardSectionProps) => {
  const navigate = useNavigate()

  const renderContent = () => {
    if (isLoading) return <LoadingIndicator className="py-8" />
    if (memberships.length === 0) {
      return (
        <EmptyCard
          title={`사용 가능한 회원권이 없어요.\n회원권 구매 후 예약이 가능해요.`}
          button="회원권 구매하기"
          onClick={() => navigate("/membership")}
        />
      )
    }
    return (
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        style={{ overflow: "visible" }}
        className="mt-2"
      >
        {memberships.map((membership) => {
          const cardTitle = membership.service_name || "회원권 이름"
          return (
            <SwiperSlide key={membership.mp_idx} className="mr-2">
              <MembershipCard
                id={parseInt(membership.mp_idx)}
                title={cardTitle}
                count={`${membership.remain_amount}회 / ${membership.buy_amount}회`}
                startDate={membership.pay_date}
                endDate={membership.expiration_date}
                status={getStatusFromString(membership.status)}
                showReserveButton={true}
                serviceType={membership.s_type.replace("회원권", "").trim()}
                branchs={membership.branchs}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    )
  }

  return (
    <div className="mt-6 px-5">
      <Title
        type="arrow"
        title="보유 회원권"
        count={`${memberships.length}개`}
        onClick={() => navigate(`/member-history/membership`)}
      />
      {renderContent()}
    </div>
  )
}
