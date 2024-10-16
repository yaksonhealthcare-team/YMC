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
import "swiper/swiper-bundle.css"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()

  const navigate = useNavigate()
  useEffect(() => {
    setHeader({
      display: false,
    })

    setNavigation({ display: true })
  }, [])

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
    <Container className={"relative w-full h-full bg-[#F8F5F2] py-4"}>
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

      <Title
        className="mt-6"
        type="arrow"
        title="예정된 예약"
        count="4건"
        onClick={() => {
          alert("button clicked")
        }}
      />
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        style={{ overflow: "visible" }}
      >
        {reserveCardsData.map((data, index) => (
          <SwiperSlide key={index}>
            <ReserveCard {...data} className="mt-2" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Title
        className="mt-6"
        type="arrow"
        title="보유 회원권"
        count="3개"
        onClick={() => {
          alert("button clicked")
        }}
      />
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        style={{ overflow: "visible" }}
      >
        {membershipCardsData.map((data, index) => (
          <SwiperSlide key={index}>
            <MembershipCard {...data} className="mt-2" />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="absolute bottom-4 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        onClick={() => navigate("/dev")}
      >
        dev
      </button>
    </Container>
  )
}

export default Home
