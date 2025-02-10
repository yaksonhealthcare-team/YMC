import { lazy, ReactNode } from "react"
import WithdrawalPage from "../pages/profile/WithdrawalPage"
import Store from "../pages/store/Store"

export interface RouteConfig {
  path: string
  element: ReactNode
  auth?: boolean
  children?: RouteConfig[]
}

const Home = lazy(() => import("../pages/home/Home"))
const Login = lazy(() => import("../pages/login/Login"))
const Membership = lazy(() => import("../pages/membership/Membership"))
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
const FavoritePage = lazy(() => import("../pages/favorite/FavoritePage"))
const PaymentHistoryPage = lazy(
  () => import("../pages/payment/PaymentHistoryPage"),
)
const ReviewPage = lazy(() => import("../pages/review/ReviewPage"))
const InquiryPage = lazy(() => import("../pages/inquiry/InquiryPage"))
const EventPage = lazy(() => import("../pages/event/EventPage"))
const NoticePage = lazy(() => import("../pages/notice/NoticePage"))
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"))
const EventDetailPage = lazy(() => import("../pages/event/EventDetailPage"))
const NoticeDetailPage = lazy(() => import("../pages/notice/NoticeDetail"))
const LocationSettings = lazy(
  () => import("../pages/branch/_fragments/LocationSettings"),
)
const ReservationDetailPage = lazy(
  () => import("../pages/reservation/ReservationDetailPage"),
)
const ReservationCancelPage = lazy(
  () => import("../pages/reservation/ReservationCancelPage"),
)
const SatisfactionPage = lazy(
  () => import("../pages/reservation/satisfaction/SatisfactionPage"),
)
const MembershipUsageHistory = lazy(
  () => import("../pages/membership/MembershipUsageHistory"),
)
const ReservationFormPage = lazy(
  () => import("../pages/reservation/ReservationFormPage"),
)
const BranchSearch = lazy(() => import("../pages/branch/search/BranchSearch"))
const ResetPasswordComplete = lazy(
  () => import("@components/resetPassword/ResetPasswordComplete"),
)
const ReviewFormPage = lazy(() => import("../pages/review/ReviewFormPage"))
const ReviewDetailPage = lazy(() => import("../pages/review/ReviewDetailPage"))
const ActiveBranch = lazy(
  () => import("../pages/myPage/activeBranch/ActiveBranch"),
)
const EditProfile = lazy(() => import("../pages/editProfile/EditProfile"))
const Questionnaire = lazy(() => import("../pages/questionnaire/Questionnaire"))
const QuestionnaireComplete = lazy(
  () => import("../pages/questionnaire/QusetionnaireComplete"),
)
const GeneralQuestionnaireHistory = lazy(
  () => import("../pages/myPage/questionnaire/GeneralQuestionnaireHistory"),
)
const ReservationQuestionnaireHistory = lazy(
  () => import("../pages/myPage/questionnaire/ReservationQuestionnaireHistory"),
)
const FindAccount = lazy(() => import("../pages/findAccount/FindAccount"))
const FindEmail = lazy(() => import("../pages/findAccount/FindEmail"))
const ProfileResetPassword = lazy(
  () => import("../pages/editProfile/ProfileResetPassword"),
)
const FindAccountResetPassword = lazy(
  () => import("../pages/findAccount/FindAccountResetPassword"),
)
const CartPage = lazy(() => import("../pages/cart/CartPage"))
const TermsPage = lazy(() => import("../pages/terms/TermsPage"))
const ServiceTermsPage = lazy(() => import("../pages/terms/ServiceTermsPage"))
const PrivacyTermsPage = lazy(() => import("../pages/terms/PrivacyTermsPage"))
const LocationTermsPage = lazy(() => import("../pages/terms/LocationTermsPage"))
const MarketingTermsPage = lazy(
  () => import("../pages/terms/MarketingTermsPage"),
)
const PaymentPage = lazy(() => import("../pages/payment/PaymentPage"))
const AddUsingBranch = lazy(
  () => import("../pages/addUsingBranch/AddUsingBranch"),
)
const PaymentHistoryDetailPage = lazy(
  () => import("../pages/payment/PaymentHistoryDetailPage"),
)
const PaymentCancelPage = lazy(
  () => import("../pages/payment/PaymentCancelPage"),
)
const PaymentCancelCompletePage = lazy(
  () => import("../pages/payment/PaymentCancelCompletePage"),
)
const ReservationHistory = lazy(
  () => import("../pages/memberHistory/ReservationHistory"),
)
const MembershipHistoryPage = lazy(
  () => import("../pages/member-history/membership/MembershipHistoryPage"),
)
const ProfileChangePhoneNumber = lazy(
  () => import("../pages/editProfile/ProfileChangePhoneNumber"),
)
const PaymentCompletePage = lazy(
  () => import("../pages/payment/PaymentCompletePage"),
)
const BrandDetailPage = lazy(() => import("../pages/brand/BrandDetail"))
const OAuthCallback = lazy(() => import("../pages/oauth/OAuthCallback"))
const LocationPickerMap = lazy(
  () => import("../pages/branch/_fragments/LocationPickerMap"),
)
const SignupCallback = lazy(() => import("../pages/signup/SignupCallback"))
const PaymentCallbackPage = lazy(
  () => import("../pages/payment/PaymentCallbackPage"),
)

export const routeConfig: RouteConfig[] = [
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
    path: "/brand/:brandCode",
    element: <BrandDetailPage />,
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
    path: "/signup/callback",
    element: <SignupCallback />,
  },
  {
    path: "/signup/complete",
    element: <SignupComplete />,
  },
  {
    path: "/signup/branch",
    element: <AddUsingBranch />,
  },
  // 비밀번호 찾기, 이메일 찾기
  {
    path: "/find-account",
    element: <FindAccount />,
  },
  {
    path: "/find-account/find-email",
    element: <FindEmail />,
  },
  {
    path: "/find-account/reset-password",
    element: <FindAccountResetPassword />,
  },
  {
    path: "/find-account/reset-password/complete",
    element: <ResetPasswordComplete />,
  },
  // 문진작성
  {
    path: "/questionnaire/common",
    element: <Questionnaire type="common" />,
  },
  {
    path: "/questionnaire/reservation",
    element: <Questionnaire type="reservation" />,
  },
  {
    path: "/questionnaire/complete",
    element: <QuestionnaireComplete />,
    auth: true,
  },
  //구매, 스토어, 예약
  {
    path: "/membership",
    element: <Membership />,
    auth: true,
  },
  {
    path: "/membership/usage/:id",
    element: <MembershipUsageHistory />,
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
  },
  {
    path: "/member-history/reservation",
    element: <ReservationHistory />,
    auth: true,
  },
  {
    path: "/member-history/membership",
    element: <MembershipHistoryPage />,
    auth: true,
  },
  {
    path: "/reservation/form",
    element: <ReservationFormPage />,
    auth: true,
  },
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
    path: "/reservation/:id/satisfaction",
    element: <SatisfactionPage />,
    auth: true,
  },
  //마이페이지
  {
    path: "/mypage",
    element: <MyPage />,
    auth: true,
  },
  {
    path: "/mypage/active-branch",
    element: <ActiveBranch />,
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
    path: "/mypage/questionnaire/common",
    element: <GeneralQuestionnaireHistory />,
    auth: true,
  },
  {
    path: "/mypage/questionnaire/reservation",
    element: <ReservationQuestionnaireHistory />,
    auth: true,
  },
  {
    path: "/payment_history",
    element: <PaymentHistoryPage />,
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
    path: "/cart",
    element: <CartPage />,
    auth: true,
  },
  //결제
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/payment/complete",
    element: <PaymentCompletePage />,
  },
  {
    path: "/payment/:id/cancel",
    element: <PaymentCancelPage />,
    auth: true,
  },
  {
    path: "/payment/:id",
    element: <PaymentHistoryDetailPage />,
    auth: true,
  },
  {
    path: "/payment/cancel/complete",
    element: <PaymentCancelCompletePage />,
    auth: true,
  },
  //리뷰
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
    path: "/review/:reviewId",
    element: <ReviewDetailPage />,
    auth: true,
  },
  //이벤트, 공지사항
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
  //설정
  {
    path: "/settings/notifications",
    element: <SettingsPage />,
    auth: true,
  },
  //약관
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/terms/service",
    element: <ServiceTermsPage />,
  },
  {
    path: "/terms/privacy",
    element: <PrivacyTermsPage />,
  },
  {
    path: "/terms/location",
    element: <LocationTermsPage />,
  },
  {
    path: "/terms/marketing",
    element: <MarketingTermsPage />,
  },
  //프로필
  {
    path: "/profile",
    element: <EditProfile />,
  },
  {
    path: "/profile/reset-password",
    element: <ProfileResetPassword />,
  },
  {
    path: "/profile/reset-password/complete",
    element: <ResetPasswordComplete />,
  },
  {
    path: "/profile/change-phone",
    element: <ProfileChangePhoneNumber />,
  },
  {
    path: "/profile/withdrawal",
    element: <WithdrawalPage />,
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
    path: "/branch/location/picker",
    element: <LocationPickerMap />,
  },
  {
    path: "/branch/search",
    element: <BranchSearch />,
  },
  {
    path: "/branch/:id",
    element: <BranchDetail />,
  },
  // OAuth 콜백
  {
    path: "/oauth/callback/:provider",
    element: <OAuthCallback />,
  },
  {
    path: "/payment/callback",
    element: <PaymentCallbackPage />,
    auth: true,
  },
]

export default routeConfig
