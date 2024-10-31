import Home from "../pages/home/Home.tsx"
import Login from "../pages/login/Login.tsx"

import Purchase from "../pages/purchase/Purchase.tsx"
import Store from "../pages/store/Store.tsx"
import Reservation from "../pages/reservation/Reservation.tsx"
import MyPage from "../pages/myPage/MyPage.tsx"
import Logout from "../pages/logout/Logout.tsx"
import { ReactNode } from "react"
import Dev from "../pages/DevPage.tsx"
import Branch from "../pages/branch/Branch.tsx"
import { Notification } from "../pages/home/Notification.tsx"
import BranchDetail from "../pages/branch/[id]/BranchDetail.tsx"
import FavoritePage from "../pages/favorite/FavoritePage.tsx"
import PaymentPage from "../pages/payment/PaymentPage.tsx"
import ReviewPage from "../pages/revivew/ReviewPage.tsx"
import InquiryPage from "../pages/inquiry/InquiryPage.tsx"
import EventPage from "../pages/event/EventPage.tsx"
import NoticePage from "../pages/notice/NoticePage.tsx"
import SettingsPage from "../pages/settings/SettingsPage.tsx"
import PointPage from "../pages/point/PointPage.tsx"

interface RouteConfig {
  path: string
  element: ReactNode
  auth?: boolean
  children?: RouteConfig[]
}

const routeConfig: RouteConfig[] = [
  {
    path: "/dev",
    element: <Dev />,
  },
  //홈
  {
    path: "/",
    element: <Home />,
    auth: true,
  },
  //알림
  {
    path: "/notification",
    element: <Notification />,
    auth: true,
  },
  //브랜드관
  {
    path: "/brand",
    element: <div>Brand</div>,
  },

  //로그인, 회원가입, 비밀번호 찾기, 이메일 찾기
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/signup",
    element: <div>Signup</div>,
  },
  {
    path: "/reset-password",
    element: <div>Reset Password</div>,
  },
  {
    path: "/find-email",
    element: <div>Find Email</div>,
  },

  //구매, 스토어, 예약
  { path: "/purchase", element: <Purchase />, auth: true },
  { path: "/store", element: <Store />, auth: false },
  { path: "/reservation", element: <Reservation />, auth: true },

  //마이페이지
  {
    path: "/mypage",
    element: <MyPage />,
    auth: true,
  },
  {
    path: "/myinfo",
    element: <div>My Info</div>,
    auth: true,
  },
  {
    path: "/point",
    element: <PointPage />,
    auth: true,
  },
  {
    path: "/questionnaire",
    element: <div>Questionnaire</div>,
    auth: true,
  },
  {
    path: "/inquiry",
    element: <InquiryPage />,
    auth: true,
  },
  {
    path: "/favorite",
    element: <FavoritePage />,
    auth: true,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
    auth: true,
  },
  {
    path: "/review",
    element: <ReviewPage />,
    auth: true,
  },
  {
    path: "/event",
    element: <EventPage />,
  },
  {
    path: "/notice",
    element: <NoticePage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    auth: true,
  },
  {
    path: "/terms",
    element: <div>Terms</div>,
  },
  //지점 찾기, 지점 상세보기
  {
    path: "/branch",
    element: <Branch />,
  },
  {
    path: "/branch/:id",
    element: <BranchDetail />,
  },
]

export default routeConfig
