import Home from "../pages/home/Home.tsx"
import Login from "../pages/login/Login.tsx"
import Purchase from "../pages/purchase/Purchase.tsx"
import Store from "../pages/store/Store.tsx"
import Reservation from "../pages/reservation/Reservation.tsx"
import MyPage from "../pages/myPage/MyPage.tsx"
import { Link } from "@mui/material"
import Logout from "../pages/logout/Logout.tsx"

const routeConfig = [
  //홈
  {
    path: "/",
    element: <Home />,
    auth: true,
  },
  //알림
  {
    path: "/notification",
    element: <div>Notification</div>,
    auto: true,
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
    auth: false,
  },
  {
    path: "/myinfo",
    element: <div>My Info</div>,
    auth: true,
  },
  {
    path: "/branch",
    element: <div>Branch</div>,
    auth: true,
  },
  {
    path: "/point",
    element: <div>Point</div>,
    auth: true,
  },
  {
    path: "/questionnaire",
    element: <div>Questionnaire</div>,
    auth: true,
  },
  {
    path: "/favorite",
    element: <div>Favorite</div>,
    auth: true,
  },
  {
    path: "/payment",
    element: <div>Payment</div>,
    auth: true,
  },
  {
    path: "/review",
    element: <div>Review</div>,
    auth: true,
  },
  {
    path: "/event",
    element: <div>Event</div>,
  },
  {
    path: "/notice",
    element: <div>Notice</div>,
  },
  {
    path: "/notification",
    element: <div>Notification</div>,
    auth: true,
  },
  {
    path: "/terms",
    element: <div>Terms</div>,
  },
  //지점 찾기, 지점 상세보기
  {
    path: "/branch",
    element: <div>Branch</div>,
    children: [
      {
        path: "/branch/:id",
        element: <div>Branch Detail</div>,
      },
    ],
  },
]

export default routeConfig
