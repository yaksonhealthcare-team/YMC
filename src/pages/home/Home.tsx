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
import { BrandCard } from "@components/BrandCard.tsx"
import { FloatingButton } from "@components/FloatingButton.tsx"
import { EmptyCard } from "@components/EmptyCard.tsx"
import { ReserveCard } from "@components/ReserveCard.tsx"
import { Reservation } from "types/Reservation.ts"
import { useReservations } from "queries/useReservationQueries.tsx"
import { useMembershipList } from "queries/useMembershipQueries.tsx"
import SplashScreen from "@components/Splash.tsx"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()

  const navigate = useNavigate()
  useEffect(() => {
    setHeader({
      display: false,
    })

    setNavigation({ display: true })
  }, [])

  return (
    <>
      <Container
        className={
          "relative w-full bg-system-bg py-4 overflow-x-hidden scrollbar-hide"
        }
      >
        <DynamicHomeHeaderBackground
          header={
            <div className={"space-y-2"}>
              <Logo text size={136} />
              <Typography className="text-sm text-gray-500">
                [공지] 9월 1일 회원권 변경사항 안내드립니다.
              </Typography>
            </div>
          }
          content={
            <div>
              <div className="flex justify-between items-center bg-primary-300 rounded-2xl p-4">
                <div className="flex gap-2 flex-col text-white">
                  <Typography className={"font-b"}>
                    <span className={"text-18px"}>김민정님</span> 반갑습니다.
                  </Typography>
                  <Typography className="font-m text-14px space-x-2">
                    <span>SILVER</span> <span>10,000 P</span>
                  </Typography>
                </div>
                {/* TODO: 예약 필요 정보와 함께 이동 필요 */}
                <div
                  className="rounded-full bg-white text-primary-300 py-2.5 px-5 cursor-pointer"
                  onClick={() => navigate("/reservation/form")}
                >
                  예약하기
                </div>
              </div>
              {/* 배너영역*/}
              <div className="mt-4">
                {/* TODO: 실 데이터 연동, 사이즈에 관계없이 동일하게 보이도록 레이아웃 조정 필요 */}
                <img
                  src="/assets/home_banner.png"
                  alt="배너영역"
                  className="w-full h-[144px] object-cover rounded-2xl "
                  onClick={() => navigate("/membership")}
                />
              </div>
            </div>
          }
          buttonArea={
            <button
              className="w-full h-full bg-primary-300 text-white rounded-full shadow-lg flex justify-center items-center"
              onClick={() => navigate("/notification")}
            >
              <NotiIcon className="text-white" />
            </button>
          }
        />

        <ReserveCardSection />
        <MembershipCardSection />
        <BrandSection />
        <EventSection />
        <BusinessInfo />

        <button
          className="fixed bottom-40 right-5 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 z-10"
          onClick={() => navigate("/dev")}
        >
          dev
        </button>
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

const ReserveCardSection = () => {
  const navigate = useNavigate()
  const { data: reservations } = useReservations("001")

  const upcomingReservations = useMemo(() => {
    if (!reservations?.pages) return []
    return reservations.pages.flatMap((page) => page)
  }, [reservations])

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="예정된 예약"
        count={`${upcomingReservations.length}건`}
        onClick={() => navigate("/member-history/reservation")}
      />
      {upcomingReservations.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {upcomingReservations.map((reservation: Reservation) => (
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

const MembershipCardSection = () => {
  const navigate = useNavigate()
  const { data: memberships, isLoading } = useMembershipList("T") // 사용가능 회원권 필터

  const availableMemberships = useMemo(() => {
    if (!memberships?.pages) return []
    return memberships.pages.flatMap((page) => page)
  }, [memberships])

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="보유 회원권"
        count={`${availableMemberships.length}개`}
        onClick={() => navigate(`/member-history/membership`)}
      />
      {isLoading ? (
        <SplashScreen />
      ) : availableMemberships.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {availableMemberships.map((membership) => (
            <SwiperSlide key={membership.id} className="mr-2">
              <MembershipCard
                id={parseInt(membership.id)}
                title={membership.serviceName || membership.serviceType}
                count={`${membership.remainCount}회 / ${membership.totalCount}회`}
                date={`${membership.purchaseDate} - ${membership.expirationDate}`}
                status={membership.status}
                serviceType={membership.serviceType}
                showReserveButton={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`사용 가능한 회원권이 없어요.\n회원권 구매 후 예약이 가능해요.`}
          button="회원권 구매하기"
        />
      )}
    </div>
  )
}

const BrandSection = () => {
  return (
    <div className="mt-6">
      <Title title="브랜드 관" />
      <div className="mt-2 flex gap-4">
        <BrandCard
          brandSrc="/assets/home_logo_therapist.png"
          name="약손명가"
          onClick={() => {
            alert("clicked")
          }}
        />
        <BrandCard
          brandSrc="/assets/home_logo_dalia.png"
          name="달리아 스파"
          onClick={() => {
            alert("clicked")
          }}
        />
        <BrandCard
          brandSrc="/assets/home_logo_diet.png"
          name="여리한 다이어트"
          onClick={() => {
            alert("clicked")
          }}
        />
      </div>
    </div>
  )
}

const EventSection = () => {
  const navigate = useNavigate()

  const EventCardsData: Array<{
    imageSrc: string
    title: string
    date: string
    id: number
  }> = [
    {
      imageSrc: "/assets/home_event.png",
      title: "애정에 애정을 더하며☘️",
      date: "2024.08.12",
      id: 1,
    },
    {
      imageSrc: "/assets/home_event.png",
      title: "장마 맞이 시원한 할인!",
      date: "2024.08.12",
      id: 2,
    },
  ]
  return (
    <div className="mt-6">
      <Title title="이벤트 프로모션" />
      <Swiper
        spaceBetween={10}
        slidesPerView={1.1}
        style={{ overflow: "visible" }}
        className="mt-2"
      >
        {EventCardsData.map((data, index) => (
          <SwiperSlide key={index} className="mr-3">
            <div
              className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
              // TODO: 실제 이벤트 아이디를 이용해 이벤트 상세 페이지로 이동
              // onClick={() => navigate(`/event/${data.id}`)}
              onClick={() => navigate(`/event/${data.id}`)}
            >
              <div
                style={{ backgroundImage: `url(${data.imageSrc})` }}
                className="w-full h-[190px] bg-cover bg-center rounded-t-[20px]"
              ></div>
              <div className="flex flex-col px-5 gap-1.5">
                <span className="font-b text-16px text-gray-700">
                  {data.title}
                </span>
                <span className="font-r text-12px text-gray-600">
                  {data.date}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
