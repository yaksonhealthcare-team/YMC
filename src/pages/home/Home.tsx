import "swiper/swiper-bundle.css"
import { useEffect, useMemo } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { useNavigate } from "react-router-dom"
import { Container, Typography } from "@mui/material"
import DynamicHomeHeaderBackground from "./_fragments/DynamicHomeHeaderBackground"
import Logo from "@components/Logo"
import NotiIcon from "@assets/icons/NotiIcon.svg?react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FloatingButton } from "@components/FloatingButton"
import { useUserMemberships } from "queries/useMembershipQueries"
import SplashScreen from "@components/Splash"
import { Pagination } from "swiper/modules"
import { useBanner } from "queries/useBannerQueries"
import { BannerRequestType } from "types/Banner"
import NoticesSummarySlider from "@components/NoticesSummarySlider"
import { useAuth } from "../../contexts/AuthContext"
import { useUnreadNotificationsCount } from "../../queries/useNotificationQueries"
import { MembershipCardSection } from "./../../pages/home/_fragments/MembershipCardSection"
import { BrandSection } from "./../../pages/home/_fragments/BrandSection"
import { EventSection } from "./../../pages/home/_fragments/EventSection"
import { BusinessInfo } from "./../../pages/home/_fragments/BusinessInfo"
import { ReserveCardSection } from "./../../pages/home/_fragments/ReserveCardSection"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data: mainBanner } = useBanner(
    {
      gubun: BannerRequestType.SLIDE,
      area01: "Y",
      area02: "Y",
    },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  )
  const { data: memberships, isLoading: membershipLoading } =
    useUserMemberships("T")
  const { user } = useAuth()
  const navigate = useNavigate()
  const { clear } = useMembershipOptionsStore()
  const { data: unreadCount = 0 } = useUnreadNotificationsCount()

  const getDisplayCount = (count: number) => {
    if (count > 99) return "99+"
    return count
  }

  const availableMemberships = useMemo(() => {
    if (!memberships?.pages[0]?.body) return []
    return memberships.pages[0].body
  }, [memberships])

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: true })
  }, [])

  const handleReservationClick = () => {
    navigate("/reservation/form", {
      state: {
        originalPath: "/",
        fromHome: true
      }
    })
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
                fromPath="/"
                left={<span className="min-w-[40px]">[공지]</span>}
              />
            </div>
          }
          contents={[
            <div
              key="user-info"
              className="flex justify-between items-center bg-primary-300 rounded-2xl p-4"
            >
              <div className="flex gap-2 flex-col text-white">
                <Typography>
                  <span className={"text-18px font-b"}>{user?.name}님</span>{" "}
                  반갑습니다.
                </Typography>
                <Typography className="font-m text-14px">
                  <span className="mr-2">{user?.levelName}</span>{" "}
                  <span className="font-b mr-[2px]">{user?.point || 0}</span>
                  <span>P</span>
                </Typography>
              </div>
              <button
                className="rounded-full bg-white text-primary-300 py-2 px-5 font-sb whitespace-nowrap text-14px"
                onClick={handleReservationClick}
                aria-label="예약하기"
              >
                예약하기
              </button>
            </div>,
            mainBanner?.[0]?.isVisible && (
              <div key="banner" className="mt-3">
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
                  {mainBanner?.map((banner) => {
                    const getBannerLink = (link: string) => {
                      if (link.startsWith("http")) return link
                      return `https://${link}`
                    }

                    return (
                      <SwiperSlide key={banner.code}>
                        <button
                          className="w-full"
                          onClick={() => {
                            window.location.href =
                              getBannerLink(banner.link) || "/membership"
                          }}
                          aria-label={banner.title}
                        >
                          <img
                            src={banner.fileUrl}
                            alt={banner.title}
                            className="w-full h-[144px] object-cover rounded-2xl"
                          />
                        </button>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            ),
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
                    {getDisplayCount(unreadCount)}
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

export default Home
