import { useNavigate } from "react-router-dom"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import BookmarkIcon from "@assets/icons/BookmarkIcon.svg?react"
import PaymentIcon from "@assets/icons/PaymentIcon.svg?react"
import ReviewIcon from "@assets/icons/ReviewIcon.svg?react"
import InquiryIcon from "@assets/icons/InquiryIcon.svg?react"
import EventIcon from "@assets/icons/EventIcon.svg?react"
import NoticeIcon from "@assets/icons/NoticeIcon.svg?react"
import NotificationIcon from "@assets/icons/NotificationIcon.svg?react"

interface CustomWindow extends Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void
    onMessage: (value: string) => void
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

const MyPageMenu = () => {
  const navigate = useNavigate()
  const customWindow = window as CustomWindow

  const handleClick = (item: (typeof menuItems)[0]) => {
    if (item.external) {
      if (customWindow.ReactNativeWebView) {
        customWindow.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "OPEN_EXTERNAL_LINK",
            payload: { url: item.path },
          }),
        )
      } else if (customWindow.webkit?.messageHandlers.openExternalLink) {
        customWindow.webkit.messageHandlers.openExternalLink.postMessage(
          item.path,
        )
      } else if (customWindow.Android?.openExternalLink) {
        customWindow.Android.openExternalLink(item.path)
      } else {
        window.open(item.path, "_blank")
      }
    } else {
      if (item.id === "notice") {
        navigate(item.path, { state: { from: "/mypage" } })
      } else {
        navigate(item.path)
      }
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
          aria-label={`${item.title}${item.external ? " (외부 링크)" : ""}`}
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
