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
    <Container className={"relative w-full bg-[#F8F5F2] py-4"}>
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
              <div className="rounded-full bg-white text-primary-300 py-2.5 px-5">
                예약하기
              </div>
            </div>
            {/* 배너영역*/}
            <div className="mt-4">
              <img
                src="/assets/home_banner.png"
                alt="배너영역"
                className="w-full h-12 object-cover rounded-2xl"
              />
            </div>
          </div>
        }
        buttonArea={
          <button
            className="w-full h-full bg-primary-300 text-white rounded-full shadow-lg flex justify-center items-center"
            onClick={() => navigate("/dev")}
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

      <FloatingButton
        type="search"
        onClick={() => {
          alert("FloatingButton Clicked")
        }}
      />
      <button
        className="absolute bottom-4 right-20 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 z-10"
        onClick={() => navigate("/dev")}
      >
        dev
      </button>
    </Container>
  )
}

const ReserveCardSection = () => {
  // 예약
  const reserveCardsData: Array<{
    type: "pre" | "ing" | "post"
    store: string
    title: string
    count: number
    date: string
    time: string
    dDay?: number
  }> = [
    {
      type: "pre",
      store: "약손명가 강남구청역점",
      title: "전신관리 120분",
      count: 3,
      date: "7월 12일 (토)",
      time: "오전 11:00",
      dDay: 8,
    },
    {
      type: "ing",
      store: "약손명가 강남구청역점",
      title: "전신관리 120분",
      count: 2,
      date: "7월 12일 (토)",
      time: "오전 11:00",
      dDay: 0,
    },
    {
      type: "post",
      store: "약손명가 강남구청역점",
      title: "전신관리 120분",
      count: 1,
      date: "7월 12일 (토)",
      time: "오전 11:00",
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
              <ReserveCard {...data} />
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
  const membershipCardsData: Array<{
    type: "default" | "reserve" | "used"
    title: string
    count: string
    date: string
  }> = [
    {
      type: "reserve",
      title: "K-BEAUTY 연예인관리",
      count: "4회 / 20",
      date: "2024.04.01 - 2024.12.31",
    },
    {
      type: "used",
      title: "K-BEAUTY 연예인관리",
      count: "4회 / 20",
      date: "2024.04.01 - 2024.12.31",
    },
    {
      type: "default",
      title: "K-BEAUTY 연예인관리",
      count: "4회 / 20",
      date: "2024.04.01 - 2024.12.31",
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
              <MembershipCard {...data} />
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
  const EventCardsData: Array<{
    imageSrc: string
    title: string
    date: string
  }> = [
    {
      imageSrc: "/assets/home_event.png",
      title: "애정에 애정을 더하며☘️",
      date: "2024.08.12",
    },
    {
      imageSrc: "/assets/home_event.png",
      title: "장마 맞이 시원한 할인!",
      date: "2024.08.12",
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
            <div className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100">
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
