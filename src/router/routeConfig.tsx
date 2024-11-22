import Home from "../pages/home/Home.tsx"
import Login from "../pages/login/Login.tsx"

import Membership from "../pages/membership/Membership.tsx"
import Store from "../pages/store/Store.tsx"
import MyPage from "../pages/myPage/MyPage.tsx"
import Logout from "../pages/logout/Logout.tsx"
import { ReactNode } from "react"
import Dev from "../pages/DevPage.tsx"
import Branch from "../pages/branch/Branch.tsx"
import { Notification } from "../pages/home/Notification.tsx"
import BranchDetail from "../pages/branch/[id]/BranchDetail.tsx"
import FavoritePage from "../pages/favorite/FavoritePage.tsx"
import PaymentPage from "../pages/payment/PaymentPage.tsx"
import ReviewPage from "../pages/review/ReviewPage.tsx"
import InquiryPage from "../pages/inquiry/InquiryPage.tsx"
import EventPage from "../pages/event/EventPage.tsx"
import NoticePage from "../pages/notice/NoticePage.tsx"
import SettingsPage from "../pages/settings/SettingsPage.tsx"
import PointPage from "../pages/point/PointPage.tsx"
import EventDetailPage from "../pages/event/EventDetailPage.tsx"
import NoticeDetailPage from "../pages/notice/NoticeDetail.tsx"
import LocationSettings from "../pages/branch/_fragments/LocationSettings.tsx"
import MembershipDetailPage from "../pages/membership/MembershipDetailPage.tsx"
import EmailLogin from "../pages/login/EmailLogin.tsx"
import { Navigate } from "react-router-dom"
import TermsAgreement from "../pages/signup/TermsAgreement.tsx"
import EmailPassword from "../pages/signup/EmailPassword.tsx"
import ProfileSetup from "../pages/signup/ProfileSetup.tsx"
import SignupComplete from "../pages/signup/SignupComplete.tsx"
import ReservationDetailPage from "pages/reservation/ReservationDetailPage.tsx"
import MemberHistory from "../pages/memberHistory/MemberHistory.tsx"
import ReservationCancelPage from "pages/reservation/ReservationCancelPage.tsx"
import MembershipUsageHistory from "pages/membership/MembershipUsageHistory.tsx"
import ReservationFormPage from "pages/reservation/ReservationFormPage.tsx"
import BranchSearch from "../pages/branch/search/BranchSearch.tsx"
import ReviewFormPage from "pages/review/ReviewFormPage.tsx"
import ReviewDetailPage from "pages/review/ReviewDetailPage.tsx"

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

  //로그인, 로그아웃
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/email",
    element: <EmailLogin />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },

  // 회원가입
  {
    path: "/signup",
    element: <Navigate to="/signup/terms" />,
  },
  {
    path: "/signup/terms",
    element: <TermsAgreement />,
  },
  {
    path: "/signup/email",
    element: <EmailPassword />,
  },
  {
    path: "/signup/profile",
    element: <ProfileSetup />,
  },
  {
    path: "/signup/complete",
    element: <SignupComplete />,
  },
  {
    path: "/signup/branch",
    element: <div>Set Branch</div>,
  },

  // 비밀번호 찾기, 이메일 찾기
  {
    path: "/reset-password",
    element: <div>Reset Password</div>,
  },
  {
    path: "/find-email",
    element: <div>Find Email</div>,
  },

  // 문진작성
  {
    path: "/questionnaire/general",
    element: <div>Questionnaire-일반문진</div>,
  },
  {
    path: "/questionnaire/reservation",
    element: <div>Questionnaire-예약문진</div>,
    auth: true,
  },

  //구매, 스토어, 예약
  { path: "/membership", element: <Membership />, auth: true },
  {
    path: "/membership/:id",
    element: <MembershipDetailPage />,
    auth: true,
  },
  {
    path: "/membership/usage/:id",
    element: <MembershipUsageHistory />,
    auth: true,
  },
  { path: "/store", element: <Store />, auth: false },
  { path: "/member-history/:tab?", element: <MemberHistory />, auth: true },
  {
    path: "/reservation/:id",
    element: <ReservationDetailPage />,
    auth: true,
  },
  {
    path: "/reservation/:id/cancel",
    element: <ReservationCancelPage />,
    auth: true,
  },
  {
    path: "/reservation/form",
    element: <ReservationFormPage />,
    auth: true,
  },

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
    path: "/review/form",
    element: <ReviewFormPage />,
    auth: true,
  },
  {
    path: "/review/:id",
    element: <ReviewDetailPage />,
    auth: true,
  },
  {
    path: "/event",
    element: <EventPage />,
  },
  {
    path: "/event/:id",
    element: <EventDetailPage />,
  },
  {
    path: "/notice",
    element: <NoticePage />,
  },
  {
    path: "/notice/:id",
    element: <NoticeDetailPage />,
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
    path: "/branch/location",
    element: <LocationSettings />,
  },
  {
    path: "/branch/search",
    element: <BranchSearch />,
  },
  {
    path: "/branch/:id",
    element: <BranchDetail />,
  },
]

export default routeConfig
