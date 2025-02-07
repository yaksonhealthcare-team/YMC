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
import { useUpcomingReservations } from "queries/useReservationQueries"
import { useUserMemberships } from "queries/useMembershipQueries"
import SplashScreen from "@components/Splash.tsx"
import { SwiperBrandCard } from "@components/SwiperBrandCard.tsx"
import { Pagination } from "swiper/modules"
import { useBanner } from "queries/useBannerQueries"
import { BannerRequestType } from "types/Banner"
import NoticesSummarySlider from "@components/NoticesSummarySlider.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { MyMembership } from "types/Membership"
import { useEvents } from "queries/useEventQueries"
import { Event } from "types/Event"
import LoadingIndicator from "@components/LoadingIndicator"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import { getStatusFromString } from "../../utils/membership"
import { useUnreadNotificationsCount } from "../../queries/useNotificationQueries"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data: mainBanner } = useBanner(BannerRequestType.SLIDE, {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
  const { data: memberships, isLoading: membershipLoading } =
    useUserMemberships("T")
  const { user } = useAuth()

  const navigate = useNavigate()
  const { clear } = useMembershipOptionsStore()
  const { data: unreadCount = 0 } = useUnreadNotificationsCount()

  const availableMemberships = useMemo(() => {
    if (!memberships?.pages[0]?.body) return []
    return memberships.pages[0].body
  }, [memberships])

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg", // 상단 안전영역 흰색
    })
    setNavigation({ display: true }) // 하단 안전영역 자동으로 흰색
  }, [])

  const handleReservationClick = () => {
    clear()
    navigate("/reservation/form")
  }

  if (!user) return <SplashScreen />

  return (
    <div>
      <Container className="relative w-full bg-system-bg pt-4 overflow-x-hidden scrollbar-hide px-0">
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
                <Typography>
                  <span className={"text-18px font-b"}>{user?.name}님</span>{" "}
                  반갑습니다.
                </Typography>
                <Typography className="font-m text-14px space-x-2">
                  <span>{user?.levelName}</span>{" "}
                  <span className="font-b">
                    {user && user.point ? user.point : 0}
                  </span>
                  <span>P</span>
                </Typography>
              </div>
              <div
                className="rounded-full bg-white text-primary-300 py-2 px-5 cursor-pointer font-sb"
                onClick={handleReservationClick}
              >
                예약하기
              </div>
            </div>,
            <div className="mt-3">
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
            <div className="relative">
              <button
                className="w-11 h-11 bg-primary-300 text-white rounded-full shadow-lg flex justify-center items-center"
                onClick={() => navigate("/notification")}
              >
                <NotiIcon className="text-white w-6 h-6" />
              </button>
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] bg-white border border-primary rounded-full flex items-center justify-center px-1">
                  <span className="text-primary text-[10px] leading-none font-m">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </div>
              )}
            </div>
          }
        />

        <ReserveCardSection />
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
    </div>
  )
}

const ReserveCardSection = () => {
  const { data: upcomingReservations } = useUpcomingReservations()
  const navigate = useNavigate()

  if (!upcomingReservations || upcomingReservations.length === 0) {
    return (
      <EmptyCard
        title={`예정된 예약이 없어요.\n예약을 통해 관리를 받아보세요.`}
      />
    )
  }

  return (
    <div className="mt-6 px-5">
      <Title
        type="arrow"
        title="예정된 예약"
        count={`${upcomingReservations.length}건`}
        onClick={() => navigate("/member-history/reservation")}
      />
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
    <div className="mt-6 px-5">
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
                title={membership.service_name || "회원권 이름"}
                count={`${membership.remain_amount}회 / ${membership.buy_amount}회`}
                startDate={membership.pay_date}
                endDate={membership.expiration_date}
                status={getStatusFromString(membership.status)}
                showReserveButton={true}
                serviceType={membership.s_type.replace("회원권", "").trim()}
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
      <Title className="px-5" title="브랜드 관" />
      <SwiperBrandCard className="mt-2 px-5" onBrandClick={handleBrandClick} />
    </div>
  )
}

const EventSection = () => {
  const { data: events } = useEvents()
  const navigate = useNavigate()

  return (
    <div className="mt-6 px-5">
      <Title title="이벤트 프로모션" />
      {events && events.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={events.length === 1 ? 1 : 1.1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {events.map((event: Event) => (
            <SwiperSlide
              key={event.code}
              className={events.length === 1 ? "" : "mr-3"}
            >
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
  const navigate = useNavigate()

  return (
    <div className="mt-12 px-6 pt-8 pb-10 flex flex-col gap-4 bg-white relative">
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
        <span
          className="font-sb text-14px text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/terms/privacy")}
        >
          개인정보처리방침
        </span>
        <div className="h-3.5 border-l border-gray-300"></div>
        <span
          className="font-sb text-14px text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/terms")}
        >
          이용약관
        </span>
      </div>
      <span className="font-r text-12px text-gray-300">
        © 2024. yaksonhouse. All Rights Reserved.
      </span>
    </div>
  )
}

export default Home
