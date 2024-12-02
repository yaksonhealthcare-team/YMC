import "swiper/swiper-bundle.css"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { Container, Typography } from "@mui/material"
import DynamicHomeHeaderBackground from "./_fragments/DynamicHomeHeaderBackground.tsx"
import Logo from "@components/Logo.tsx"
import NotiIcon from "@assets/icons/NotiIcon.svg?react"
import { Title } from "@components/Title.tsx"
import { ReserveCard } from "@components/ReserveCard.tsx"
import { MembershipCard } from "@components/MembershipCard.tsx"
import { Swiper, SwiperSlide } from "swiper/react"
import { BrandCard } from "@components/BrandCard.tsx"
import { FloatingButton } from "@components/FloatingButton.tsx"
import { EmptyCard } from "@components/EmptyCard.tsx"
import { MembershipItem, MembershipStatus } from "types/Membership.ts"
import { ReservationItem, ReservationStatus } from "types/Reservation.ts"

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
        className={"relative w-full bg-system-bg py-4   overflow-x-hidden"}
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
  // 예약
  const reserveCardsData: ReservationItem[] = [
    {
      id: 0,
      store: "약손명가 강남점",
      title: "전신관리 90분",
      count: 2,
      date: new Date(),
      status: ReservationStatus.IN_PROGRESS,
    },
    {
      id: 1,
      store: "약손명가 강남구청역점",
      title: "전신관리 120분",
      count: 3,
      date: new Date(),
      dDay: 8,
      status: ReservationStatus.UPCOMING,
    },
    {
      id: 2,
      store: "약손명가 서초점",
      title: "얼굴관리 60분",
      count: 1,
      date: new Date(),
      status: ReservationStatus.COMPLETED,
    },
    {
      id: 3,
      store: "약손명가 강남점",
      title: "전신관리 90분",
      count: 2,
      date: new Date(),
      status: ReservationStatus.CANCELED,
    },
  ]

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="예정된 예약"
        count={`${reserveCardsData.length}건`}
        onClick={() => {
          alert("button clicked")
        }}
      />
      {reserveCardsData.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {reserveCardsData.map((data, index) => (
            <SwiperSlide key={index} className="mr-2">
              <ReserveCard
                id={data.id}
                status={data.status}
                store={data.store}
                title={data.title}
                count={data.count}
                date={data.date}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`예정된 예약이 없어요.
나만을 위한 힐링을 시작해보세요!`}
          button="예약하러 가기"
        />
      )}
    </div>
  )
}

const MembershipCardSection = () => {
  // 회원권
  const membershipCardsData: MembershipItem[] = [
    {
      id: 0,
      status: MembershipStatus.AVAILABLE,
      title: "K-BEAUTY 연예인관리",
      count: "4회 / 20",
      startAt: "2024.04.01",
      endAt: "2024.12.31",
      isAllBranch: true,
    },
    {
      id: 1,
      status: MembershipStatus.COMPLETED,
      title: "바디케어 프로그램",
      count: "0회 / 10",
      startAt: "2024.01.01",
      endAt: "2024.03.31",
      isAllBranch: false,
    },
    {
      id: 2,
      status: MembershipStatus.EXPIRED,
      title: "럭셔리 스파",
      count: "2회 / 5",
      startAt: "2024.12.01",
      endAt: "2024.02.29",
      isAllBranch: true,
    },
  ]

  return (
    <div className="mt-6">
      <Title
        type="arrow"
        title="보유 회원권"
        count="3개"
        onClick={() => {
          alert("button clicked")
        }}
      />
      {membershipCardsData.length > 0 ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ overflow: "visible" }}
          className="mt-2"
        >
          {membershipCardsData.map((data, index) => (
            <SwiperSlide key={index} className="mr-2">
              <MembershipCard
                id={data.id}
                title={data.title}
                count={data.count}
                date={`${data.startAt} - ${data.endAt}`}
                status={data.status}
                isAllBranch={true}
                showReserveButton={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCard
          title={`사용 가능한 회원권이 없어요.
회원권 구매 후 예약이 가능해요.`}
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
