import { useNavigate } from "react-router-dom"
import { Title } from "@components/Title"
import { Swiper, SwiperSlide } from "swiper/react"
import { ReserveCard } from "@components/ReserveCard"
import { EmptyCard } from "@components/EmptyCard"
import { useUpcomingReservations } from "queries/useReservationQueries"
import { useMembershipOptionsStore } from "hooks/useMembershipOptions"

export const ReserveCardSection = () => {
  const { data: upcomingReservations } = useUpcomingReservations()
  const navigate = useNavigate()
  const { clear } = useMembershipOptionsStore()

  const handleReservationClick = () => {
    clear()
    navigate("/reservation/form")
  }

  return (
    <div className="mt-6 px-5">
      <Title
        type="arrow"
        title="예정된 예약"
        count={
          upcomingReservations?.length
            ? `${upcomingReservations.length}건`
            : "0건"
        }
        onClick={() => navigate("/member-history/reservation")}
      />
      {!upcomingReservations || upcomingReservations.length === 0 ? (
        <EmptyCard
          title={`예정된 예약이 없어요.\n예약을 통해 관리를 받아보세요.`}
          button="예약하러 가기"
          onClick={handleReservationClick}
        />
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {upcomingReservations.map((reservation) => (
            <SwiperSlide key={reservation.id}>
              <ReserveCard reservation={reservation} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
