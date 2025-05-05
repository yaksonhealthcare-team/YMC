import { useNavigate } from "react-router-dom"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import BookmarkIcon from "@assets/icons/BookmarkIcon.svg?react"
import PaymentIcon from "@assets/icons/PaymentIcon.svg?react"
import ReviewIcon from "@assets/icons/ReviewIcon.svg?react"
import InquiryIcon from "@assets/icons/InquiryIcon.svg?react"
import EventIcon from "@assets/icons/EventIcon.svg?react"
import NoticeIcon from "@assets/icons/NoticeIcon.svg?react"
import NotificationIcon from "@assets/icons/NotificationIcon.svg?react"

const menuItems = [
  {
    id: "favorite",
    title: "즐겨찾는 지점",
    path: "/favorite",
    icon: BookmarkIcon,
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

const MyPageMenu = () => {
  const navigate = useNavigate()

  const handleClick = (item: (typeof menuItems)[0]) => {
    if (item.id === "notice") {
      navigate(item.path, { state: { from: "/mypage" } })
    } else if (item.id === "inquiry") {
      window.open(item.path, "_blank")
    } else {
      navigate(item.path)
    }
  }

  return (
    <nav
      className="bg-white rounded-[20px] border border-gray-100 p-5 space-y-4"
      aria-label="마이페이지 메뉴"
    >
      {menuItems.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => handleClick(item)}
          className="flex items-center justify-between h-12 w-full rounded-lg p-1 "
          aria-label={`${item.title}`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4 h-4 text-gray-900" aria-hidden="true" />
            <span
              className={`text-16px text-gray-900 ${item.id === "notice" ? "font-semibold" : "font-m"}`}
              aria-hidden="true"
            >
              {item.title}
            </span>
          </div>
          <CaretRightIcon
            className="w-3 h-3 text-gray-900"
            aria-hidden="true"
          />
        </button>
      ))}
    </nav>
  )
}

export default MyPageMenu
