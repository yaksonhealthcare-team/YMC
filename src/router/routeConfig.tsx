import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { lazy } from "react"

export interface RouteConfig {
  path: string
  element: ReactNode
  auth?: boolean
  children?: RouteConfig[]
}

const Home = lazy(() => import("../pages/home/Home"))
const Login = lazy(() => import("../pages/login/Login"))
const Membership = lazy(() => import("../pages/membership/Membership"))
const Store = lazy(() => import("../pages/store/Store"))
const MyPage = lazy(() => import("../pages/myPage/MyPage"))
const Logout = lazy(() => import("../pages/logout/Logout"))
const Dev = lazy(() => import("../pages/DevPage"))
const Notification = lazy(() => import("../pages/home/Notification"))
const MembershipDetailPage = lazy(
  () => import("../pages/membership/MembershipDetailPage"),
)
const EmailLogin = lazy(() => import("../pages/login/EmailLogin"))
const TermsAgreement = lazy(() => import("../pages/signup/TermsAgreement"))
const EmailPassword = lazy(() => import("../pages/signup/EmailPassword"))
const ProfileSetup = lazy(() => import("../pages/signup/ProfileSetup"))
const SignupComplete = lazy(() => import("../pages/signup/SignupComplete"))
const PointPage = lazy(() => import("../pages/point/PointPage"))
const Branch = lazy(() => import("../pages/branch/Branch"))
const BranchDetail = lazy(() => import("../pages/branch/[id]/BranchDetail"))

export const routeConfig: RouteConfig[] = [
  {
    path: "/dev",
    element: <Dev />,
  },
  {
    path: "/",
    element: <Home />,
    auth: true,
  },
  {
    path: "/notification",
    element: <Notification />,
    auth: true,
  },
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
    path: "/membership",
    element: <Membership />,
    auth: true,
  },
  {
    path: "/membership/:id",
    element: <MembershipDetailPage />,
    auth: true,
  },
  {
    path: "/store",
    element: <Store />,
    auth: false,
  },
  {
    path: "/mypage",
    element: <MyPage />,
    auth: true,
  },
  {
    path: "/point",
    element: <PointPage />,
    auth: true,
  },
  {
    path: "/branch",
    element: <Branch />,
    auth: true,
  },
  {
    path: "/branch/:id",
    element: <BranchDetail />,
    auth: true,
  },
]
