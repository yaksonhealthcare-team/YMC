import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import CrownIcon from "@assets/icons/CrownIcon.svg?react"
import PersonalCardIcon from "@assets/icons/PersonalCardIcon.svg?react"
import InformationIcon from "@assets/icons/InformationIcon.svg?react"
import PointIcon from "@assets/icons/PointIcon.svg?react"
import BookmarkIcon from "@assets/icons/BookmarkIcon.svg?react"
import PaymentIcon from "@assets/icons/PaymentIcon.svg?react"
import ReviewIcon from "@assets/icons/ReviewIcon.svg?react"
import InquiryIcon from "@assets/icons/InquiryIcon.svg?react"
import EventIcon from "@assets/icons/EventIcon.svg?react"
import NoticeIcon from "@assets/icons/NoticeIcon.svg?react"
import NotificationIcon from "@assets/icons/NotificationIcon.svg?react"
import CartIcon from "@assets/icons/CartIcon.svg?react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import NoticesSummarySlider from "@components/NoticesSummarySlider.tsx"
import MegaPhoneIcon from "@assets/icons/MegaPhoneIcon.svg?react"

interface CustomWindow extends Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void
  }
  webkit?: {
    messageHandlers: {
      openExternalLink: {
        postMessage: (url: string) => void
      }
    }
  }
  Android?: {
    openExternalLink: (url: string) => void
  }
}

const MyPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: true })
  }, [navigate])

  const handleOpenQuestionnaire = () => {
    openBottomSheet(
      <div className={"flex flex-col"}>
        <p className={"mx-5 mt-5 font-sb text-18px"}>
          {"보고 싶은 문진 종류를 선택해주세요."}
        </p>
        <div className={"mt-10 border-t border-gray-50 flex gap-2 pt-3 px-5"}>
          <Button
            className={"w-full"}
            variantType={"line"}
            onClick={() => {
              closeOverlay()
              navigate("/mypage/questionnaire/reservation")
            }}
          >
            {"예약 문진 보기"}
          </Button>
          <Button
            className={"w-full"}
            variantType={"primary"}
            onClick={() => {
              closeOverlay()
              navigate("/mypage/questionnaire/general")
            }}
          >
            {"공통 문진 보기"}
          </Button>
        </div>
      </div>,
    )
  }

  const handleOpenUserLevel = () => {
    openBottomSheet(
      <div className={"flex flex-col"}>
        <p className={"font-sb text-18px px-5 pt-4"}>회원등급 안내</p>
        <div className={"px-7 py-6"}>
          <table className={"w-full border-collapse"}>
            <thead>
              <tr className={"bg-system-bg"}>
                <th
                  className={
                    "p-3 pl-5 text-16px font-medium text-gray-900 text-left w-[100px]"
                  }
                >
                  등급
                </th>
                <th
                  className={
                    "p-3 text-16px font-medium text-gray-900 text-left"
                  }
                >
                  최근 1년간 누적 결제 금액
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  A등급
                </td>
                <td className={"p-3 text-16px text-left"}>1,000만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  B등급
                </td>
                <td className={"p-3 text-16px text-left"}>330만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  C등급
                </td>
                <td className={"p-3 text-16px text-left"}>150만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  D등급
                </td>
                <td className={"p-3 text-16px text-left"}>30만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  E등급
                </td>
                <td className={"p-3 text-16px text-left"}>기본 등급</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>,
    )
  }

  const menuItems = [
    {
      id: "favorite",
      title: "즐겨찾는 지점",
      path: "/favorite",
      icon: BookmarkIcon,
    },
    {
      id: "cart",
      title: "장바구니",
      path: "/cart",
      icon: CartIcon,
    },
    {
      id: "payment",
      title: "결제 내역",
      path: "/payment_history",
      icon: PaymentIcon,
    },
    {
      id: "review",
      title: "작성한 만족도",
      path: "/review",
      icon: ReviewIcon,
    },
    {
      id: "inquiry",
      title: "1:1 문의",
      path: "https://o33vp.channel.io",
      external: true,
      icon: InquiryIcon,
    },
    {
      id: "event",
      title: "이벤트",
      path: "/event",
      icon: EventIcon,
    },
    {
      id: "notice",
      title: "공지사항",
      path: "/notice",
      icon: NoticeIcon,
    },
    {
      id: "settings",
      title: "알림설정",
      path: "/settings/notifications",
      icon: NotificationIcon,
    },
  ]

  const customWindow = window as CustomWindow

  return (
    <>
      <div className="h-fit bg-[#F8F5F2] pb-8">
        {/* Notice */}
        <div className="flex gap-[8px] items-center px-5 h-[40px] m-5 rounded-[20px] bg-white text-primary">
          <MegaPhoneIcon className="min-w-5 h-5" />
          <NoticesSummarySlider
            className={
              "w-full h-[21px] overflow-hidden text-ellipsis whitespace-nowrap"
            }
            right={
              <CaretRightIcon className="flex-shrink-0 min-w-[4px] h-4 ml-auto" />
            }
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden">
            <img
              src={user?.profileURL || "/assets/profile_image.jpeg"}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-b text-[20px] text-gray-900">
            {user?.username ?? ""}님
          </span>
        </div>

        {/* Info Cards */}
        <div className="px-5 space-y-5">
          {/* Branch Info */}
          <div
            className="p-5 bg-white rounded-2xl border border-gray-100"
            onClick={() => navigate("/mypage/active-branch")}
          >
            <div className="flex justify-between items-center">
              <span className="font-m text-14px text-gray-500">
                이용 중인 지점
              </span>
              <div className="flex items-center">
                <span className="font-sb text-14px text-gray-900">
                  {user?.brands?.length
                    ? `${user.brands[0].brandName}${user.brands.length > 1 ? ` 외 ${user.brands.length - 1}개` : ""}`
                    : "이용중인 지점이 없습니다."}
                </span>
                <CaretRightIcon className="w-3 h-3 ml-1.5" />
              </div>
            </div>
          </div>

          {/* Points & Membership */}
          <div className="flex gap-2">
            <div
              className="w-[101px] h-24 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center"
              onClick={handleOpenQuestionnaire}
            >
              <PersonalCardIcon />
              <span className="font-m text-14px text-gray-500 mt-1">
                내 문진
              </span>
            </div>
            <div className="flex-1 p-3 bg-white rounded-2xl border border-gray-100">
              <div
                className="flex justify-between items-center mb-3"
                onClick={() => navigate("/point")}
              >
                <div className="flex items-center gap-2">
                  <PointIcon />
                  <span className="font-m text-14px text-gray-500">포인트</span>
                </div>
                <div className="flex items-center">
                  <span className="font-sb text-16px text-gray-900">
                    {`${user?.point ?? 0}P`}
                  </span>
                  <CaretRightIcon className="w-3 h-3 ml-1.5" />
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-100 my-3" />
              <div
                className="flex justify-between items-center"
                onClick={handleOpenUserLevel}
              >
                <div className="flex items-center gap-2">
                  <CrownIcon />
                  <span className="font-m text-14px text-gray-500">
                    회원등급
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sb text-16px text-gray-900">
                    {user?.level ?? ""}
                  </span>
                  <InformationIcon className={"w-4 h-4 text-gray-500"} />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Button */}
          <Button
            variantType="primary"
            sizeType="m"
            onClick={() => navigate("/profile")}
            className="w-full"
          >
            프로필 수정
          </Button>

          {/* Menu List */}
          <div className="bg-white rounded-[20px] border border-gray-100 p-5 space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.external) {
                      if (customWindow.ReactNativeWebView) {
                        customWindow.ReactNativeWebView.postMessage(
                          JSON.stringify({
                            type: "OPEN_EXTERNAL_LINK",
                            url: item.path,
                          }),
                        )
                      } else if (
                        customWindow.webkit?.messageHandlers?.openExternalLink
                      ) {
                        customWindow.webkit.messageHandlers.openExternalLink.postMessage(
                          item.path,
                        )
                      } else if (customWindow.Android?.openExternalLink) {
                        customWindow.Android.openExternalLink(item.path)
                      } else {
                        window.open(item.path, "_blank")
                      }
                    } else {
                      navigate(item.path)
                    }
                  }}
                  className="flex items-center justify-between h-12"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-900" />
                    <span className="font-m text-16px text-gray-900">
                      {item.title}
                    </span>
                  </div>
                  <CaretRightIcon className="w-3 h-3 text-gray-900" />
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-4 mt-8 mb-20">
            <div className="flex items-center gap-3">
              <span
                onClick={() => navigate("/terms")}
                className="font-sb text-14px text-gray-400"
              >
                이용약관
              </span>
              <div className="w-[1px] h-3.5 bg-gray-200" />
              <span
                onClick={() => navigate("/logout")}
                className="font-sb text-14px text-gray-400"
              >
                로그아웃
              </span>
            </div>
            <span className="font-r text-12px text-gray-300">
              {/* TODO: 실제 버전 표시 */}
              v.1.1.4 version
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyPage
