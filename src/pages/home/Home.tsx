import "swiper/swiper-bundle.css"
import { useEffect, useMemo } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { Container, Typography } from "@mui/material"
import DynamicHomeHeaderBackground from "./_fragments/DynamicHomeHeaderBackground.tsx"
import Logo from "@components/Logo.tsx"
import NotiIcon from "@assets/icons/NotiIcon.svg?react"
import { Title } from "@components/Title.tsx"
import { MembershipCard } from "@components/MembershipCard.tsx"
import { Swiper, SwiperSlide } from "swiper/react"
import { FloatingButton } from "@components/FloatingButton.tsx"
import { EmptyCard } from "@components/EmptyCard.tsx"
import { ReserveCard } from "@components/ReserveCard.tsx"
import { Reservation } from "types/Reservation.ts"
import { useReservations } from "queries/useReservationQueries"
import { useUserMemberships } from "queries/useMembershipQueries"
import SplashScreen from "@components/Splash.tsx"
import { SwiperBrandCard } from "@components/SwiperBrandCard.tsx"
import { Pagination } from "swiper/modules"
import { useBanner } from "queries/useBannerQueries"
import { BannerRequestType } from "types/Banner"
import NoticesSummarySlider from "@components/NoticesSummarySlider.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { MyMembership, MembershipStatus } from "types/Membership"
import { useEvents } from "queries/useEventQueries"
import { Event } from "types/Event"
import LoadingIndicator from "@components/LoadingIndicator"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data: mainBanner } = useBanner(BannerRequestType.SLIDE, {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
  const { data: reservations } = useReservations("001")
  const { data: memberships, isLoading: membershipLoading } =
    useUserMemberships("T", {
      staleTime: 30 * 1000,
      gcTime: 1 * 60 * 1000,
    })
  const { user } = useAuth()

  const navigate = useNavigate()
  const { clear } = useMembershipOptionsStore()

  const upcomingReservations = reservations || []

  const availableMemberships = useMemo(() => {
    if (!memberships?.body) return []
    return memberships.body
  }, [memberships])

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [])

  const handleReservationClick = () => {
    clear()
    navigate("/reservation/form")
  }

  if (!user) return <SplashScreen />

  return (
    <>
      <Container className="relative w-full bg-system-bg py-4 overflow-x-hidden scrollbar-hide">
        <DynamicHomeHeaderBackground
          header={
            <div className={"space-y-2"}>
              <Logo text size={136} />
              <NoticesSummarySlider
                className={"h-[21px] mt-[12px] max-w-[90%] text-gray-500"}
                left={<span className="min-w-[40px]">[공지]</span>}
              />
            </div>
          }
          contents={[
              <div className="flex justify-between items-center bg-primary-300 rounded-2xl p-4">
                <div className="flex gap-2 flex-col text-white">
                  <Typography className={"font-b"}>
                    <span className={"text-18px"}>{user?.name}</span>{" "}
                    반갑습니다.
                  </Typography>
                  <Typography className="font-m text-14px space-x-2">
                    <span>{user?.levelName}</span>{" "}
                    <span>{user && user.point ? user.point : 0} P</span>
                  </Typography>
                </div>
                <div
                  className="rounded-full bg-white text-primary-300 py-2 px-5 cursor-pointer"
                  onClick={handleReservationClick}
                >
                  예약하기
                </div>
              </div>,
            <div className="mt-4">
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                }}
                slidesPerView={1}
                className="w-full h-[144px] rounded-2xl"
                loop={true}
              >
                <style>
                  {`
                    .swiper-pagination {
                      bottom: 4px !important;
                    }
                    .swiper-pagination-bullet {
                      width: 7px !important;
                      height: 7px !important;
                      background: transparent !important;
                      border: 1px solid white !important;
                      opacity: 1 !important;
                    }
                    .swiper-pagination-bullet-active {
                      background: white !important;
                      border-color: white !important;
                    }
                  `}
                </style>
                {mainBanner &&
                  mainBanner.map((banner, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={banner.fileUrl}
                        alt={`${banner.title}`}
                        className="w-full h-[144px] object-cover rounded-2xl"
                        onClick={() => {
                          const link = banner.link.startsWith("http")
                            ? banner.link
                            : `https://${banner.link}`
                          window.location.href = link || "/membership"
                        }}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>,
          ]}
          buttonArea={
            <button
              className="w-11 h-11 bg-primary-300 text-white rounded-full shadow-lg flex justify-center items-center"
              onClick={() => navigate("/notification")}
            >
              <NotiIcon className="text-white w-6 h-6" />
            </button>
          }
        />

        <ReserveCardSection reservations={upcomingReservations} />
        <MembershipCardSection
          memberships={availableMemberships}
          isLoading={membershipLoading}
        />
        <BrandSection />
        <EventSection />
        <BusinessInfo />

        <FloatingButton
          type="search"
          onClick={() => {
            navigate("/branch")
          }}
        />
      </Container>
    </>
  )
}

const ReserveCardSection = ({
  reservations,
}: {
  reservations: Reservation[]
}) => {
  const navigate = useNavigate()

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="예정된 예약"
        count={`${reservations.length}건`}
        onClick={() => navigate("/member-history/reservation")}
      />
      {reservations.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {reservations.map((reservation: Reservation) => (
            <SwiperSlide key={reservation.id} className="mr-2">
              <ReserveCard
                id={reservation.id}
                status={reservation.status}
                store={reservation.store}
                title={reservation.programName}
                count={reservation.visit}
                date={reservation.date}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`예정된 예약이 없어요.\n나만을 위한 힐링을 시작해보세요!`}
          button="예약하러 가기"
          onClick={() => navigate("/reservation/form")}
        />
      )}
    </div>
  )
}

const MembershipCardSection = ({
  memberships,
  isLoading,
}: {
  memberships: MyMembership[]
  isLoading: boolean
}) => {
  const navigate = useNavigate()

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="보유 회원권"
        count={`${memberships.length}개`}
        onClick={() => navigate(`/member-history/membership`)}
      />
      {isLoading ? (
        <LoadingIndicator className="py-8" />
      ) : memberships.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {memberships.map((membership) => (
            <SwiperSlide key={membership.mp_idx} className="mr-2">
              <MembershipCard
                id={parseInt(membership.mp_idx)}
                title={membership.service_name}
                count={`${membership.remain_amount}회`}
                date={`${membership.pay_date} - ${membership.expiration_date}`}
                status={membership.status as MembershipStatus}
                showReserveButton={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`사용 가능한 회원권이 없어요.\n회원권 구매 후 예약이 가능해요.`}
          button="회원권 구매하기"
          onClick={() => navigate("/membership")}
        />
      )}
    </div>
  )
}

const BrandSection = () => {
  const navigate = useNavigate()

  const handleBrandClick = (brandCode: string) => {
    navigate(`/brand/${brandCode}`)
  }

  return (
    <div className="mt-6">
      <Title title="브랜드 관" />
      <SwiperBrandCard className="mt-2" onBrandClick={handleBrandClick} />
    </div>
  )
}

const EventSection = () => {
  const { data: events } = useEvents()
  const navigate = useNavigate()

  return (
    <div className="mt-6">
      <Title title="이벤트 프로모션" />
      {events && events.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1.1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {events.map((event: Event) => (
            <SwiperSlide key={event.code} className="mr-3">
              <div
                className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
                onClick={() => navigate(`/event/${event.code}`)}
              >
                {event.files.length > 0 && (
                  <div className="w-full aspect-[16/9] relative rounded-t-[20px] overflow-hidden">
                    <img
                      src={event.files[0].fileurl}
                      alt={event.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                )}
                <div className="flex flex-col px-5 gap-1.5">
                  <span className="font-b text-16px text-gray-700">
                    {event.title}
                  </span>
                  <span className="font-r text-12px text-gray-600">
                    {event.sdate} ~ {event.edate}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`진행중인 이벤트가 없어요.\n새로운 이벤트로 곧 찾아뵐게요.`}
        />
      )}
    </div>
  )
}

const BusinessInfo = () => {
  return (
    <div className="mt-12 px-5 pt-8 pb-10 flex flex-col gap-4 bg-white relative -mx-6 -my-4">
      <span className="font-b text-16px text-gray-600">
        (주) 약손명가 헬스케어
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-r text-12px text-gray-500">대표자 : 홍길동</span>
        <span className="font-r text-12px text-gray-500">
          주소 : 서울특별시 강남구 테헤란로 10길, 동성빌딩
        </span>
        <span className="font-r text-12px text-gray-500">
          번호 : 02-1234-1234
        </span>
        <span className="font-r text-12px text-gray-500">
          통신판매업 번호 : 0000-0000-0000
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-sb text-14px text-gray-400">
          개인정보처리방침
        </span>
        <div className="h-3.5 border-l border-gray-300"></div>
        <span className="font-sb text-14px text-gray-400">이용약관</span>
      </div>
      <span className="font-r text-12px text-gray-300">
        © 2024. yaksonhouse. All Rights Reserved.
      </span>
    </div>
  )
}

export default Home
