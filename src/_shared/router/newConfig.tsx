import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../../pages/home/Home'));
const Login = lazy(() => import('../../pages/login/Login'));
const WithdrawalPage = lazy(() => import('../../pages/profile/WithdrawalPage'));
const Membership = lazy(() => import('../../pages/membership/Membership'));
const MembershipBranchSelectPage = lazy(() => import('../../pages/membership/MembershipBranchSelectPage'));
const MyPage = lazy(() => import('../../pages/myPage/MyPage'));
const Logout = lazy(() => import('../../pages/logout/Logout'));
const Dev = lazy(() => import('../../pages/DevPage'));
const Notification = lazy(() => import('../../pages/home/Notification'));
const MembershipDetailPage = lazy(() => import('../../pages/membership/MembershipDetailPage'));
const EmailLogin = lazy(() => import('../../pages/login/EmailLogin'));
const TermsAgreement = lazy(() => import('../../pages/signup/TermsAgreement'));
const EmailPassword = lazy(() => import('../../pages/signup/EmailPassword'));
const ProfileSetup = lazy(() => import('../../pages/signup/ProfileSetup'));
const SignupComplete = lazy(() => import('../../pages/signup/SignupComplete'));
const PointPage = lazy(() => import('../../pages/point/PointPage'));
const Branch = lazy(() => import('../../pages/branch/Branch'));
const BranchDetail = lazy(() => import('../../pages/branch/[id]/BranchDetail'));
const FavoritePage = lazy(() => import('../../pages/favorite/FavoritePage'));
const PaymentHistoryPage = lazy(() => import('../../pages/payment/PaymentHistoryPage'));
const ReviewPage = lazy(() => import('../../pages/review/ReviewPage'));
const InquiryPage = lazy(() => import('../../pages/inquiry/InquiryPage'));
const EventPage = lazy(() => import('../../pages/event/EventPage'));
const NoticePage = lazy(() => import('../../pages/notice/NoticePage'));
const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage'));
const EventDetailPage = lazy(() => import('../../pages/event/EventDetailPage'));
const NoticeDetailPage = lazy(() => import('../../pages/notice/NoticeDetail'));
const LocationSettings = lazy(() => import('../../pages/branch/_fragments/LocationSettings'));
const ReservationDetailPage = lazy(() => import('../../pages/reservation/ReservationDetailPage'));
const ReservationCancelPage = lazy(() => import('../../pages/reservation/ReservationCancelPage'));
const SatisfactionPage = lazy(() => import('../../pages/reservation/satisfaction/SatisfactionPage'));
const MembershipUsageHistory = lazy(() => import('../../pages/membership/MembershipUsageHistory'));
const ReservationPage = lazy(() => import('@/_shared/router/reservation/ReservationPage'));
const BranchSearch = lazy(() => import('../../pages/branch/search/BranchSearch'));
const ResetPasswordComplete = lazy(() => import('@/components/resetPassword/ResetPasswordComplete'));
const ReviewFormPage = lazy(() => import('../../pages/review/ReviewFormPage'));
const ReviewDetailPage = lazy(() => import('../../pages/review/ReviewDetailPage'));
const ActiveBranch = lazy(() => import('../../pages/myPage/activeBranch/ActiveBranch'));
const EditProfile = lazy(() => import('../../pages/editProfile/EditProfile'));
const Questionnaire = lazy(() => import('../../pages/questionnaire/Questionnaire'));
const QuestionnaireComplete = lazy(() => import('../../pages/questionnaire/QusetionnaireComplete'));
const GeneralQuestionnaireHistory = lazy(() => import('../../pages/myPage/questionnaire/GeneralQuestionnaireHistory'));
const ReservationQuestionnaireHistory = lazy(
  () => import('../../pages/myPage/questionnaire/ReservationQuestionnaireHistory')
);
const FindAccount = lazy(() => import('../../pages/findAccount/FindAccount'));
const FindAccountCallback = lazy(() => import('../../pages/findAccount/FindAccountCallback'));
const FindEmail = lazy(() => import('../../pages/findAccount/FindEmail'));
const ProfileResetPassword = lazy(() => import('../../pages/editProfile/ProfileResetPassword'));
const FindAccountResetPassword = lazy(() => import('../../pages/findAccount/FindAccountResetPassword'));
const CartPage = lazy(() => import('../../pages/cart/CartPage'));
const TermsPage = lazy(() => import('./terms/TermsPage'));
const TermsDetailPage = lazy(() => import('./terms/TermsDetailPage'));
const PaymentPage = lazy(() => import('../../pages/payment/PaymentPage'));
const AddUsingBranch = lazy(() => import('../../pages/addUsingBranch/AddUsingBranch'));
const PaymentHistoryDetailPage = lazy(() => import('../../pages/payment/PaymentHistoryDetailPage'));
const PaymentCancelPage = lazy(() => import('../../pages/payment/PaymentCancelPage'));
const PaymentCancelCompletePage = lazy(() => import('../../pages/payment/PaymentCancelCompletePage'));
const PaymentCancelDetailPage = lazy(() => import('../../pages/payment/PaymentCancelDetailPage'));
const ReservationHistoryPage = lazy(() => import('../../pages/member-history/reservation/ReservationHistoryPage'));
const MembershipHistoryPage = lazy(() => import('../../pages/member-history/membership/MembershipHistoryPage'));
const ProfileChangePhoneNumber = lazy(() => import('../../pages/editProfile/ProfileChangePhoneNumber'));
const ChangePhoneNumberCallback = lazy(() => import('../../pages/editProfile/ChangePhoneNumberCallback'));
const PaymentCompletePage = lazy(() => import('../../pages/payment/PaymentCompletePage'));
const BrandDetailPage = lazy(() => import('../../pages/brand/BrandDetailPage'));
const OAuthCallback = lazy(() => import('./oauth/OAuthCallback'));
const LocationPickerMap = lazy(() => import('../../pages/branch/_fragments/LocationPickerMap'));
const AddressConfirm = lazy(() => import('../../pages/branch/_fragments/AddressConfirm'));
const SignupCallback = lazy(() => import('../../pages/signup/SignupCallback'));
const PaymentCallbackPage = lazy(() => import('../../pages/payment/PaymentCallbackPage'));
const PaymentFailedPage = lazy(() => import('../../pages/payment/PaymentFailedPage'));
const StorePage = lazy(() => import('../../pages/store/Store'));
const PopupDetailPage = lazy(() => import('../../pages/popup/PopupDetailPage'));

export type CustomRouteObject = RouteObject & {
  /**
   * 로그인 여부 검증,
   * true시 검증 안함
   */
  noAuth?: boolean;

  /**
   * 개발 서버에서만 사용할 페이지인지 설정
   */
  isDev?: boolean;
};

/**
 * 로그인 여부 검증 페이지
 */
const authRoutes: CustomRouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/notification', element: <Notification /> },
  { path: '/questionnaire/common', element: <Questionnaire type="common" /> },
  { path: '/questionnaire/reservation', element: <Questionnaire type="reservation" /> },
  { path: '/questionnaire/complete', element: <QuestionnaireComplete /> },
  { path: '/membership/branch-select', element: <MembershipBranchSelectPage /> },
  { path: '/membership/usage/:id', element: <MembershipUsageHistory /> },
  { path: '/membership/:id', element: <MembershipDetailPage /> },
  { path: '/popup/:code', element: <PopupDetailPage /> },
  { path: '/member-history/reservation', element: <ReservationHistoryPage /> },
  { path: '/member-history/membership', element: <MembershipHistoryPage /> },
  { path: '/reservation', element: <ReservationPage /> },
  { path: '/reservation/:id', element: <ReservationDetailPage /> },
  { path: '/reservation/:id/cancel', element: <ReservationCancelPage /> },
  { path: '/reservation/:id/satisfaction', element: <SatisfactionPage /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/mypage/active-branch', element: <ActiveBranch /> },
  { path: '/point', element: <PointPage /> },
  { path: '/mypage/questionnaire/common', element: <GeneralQuestionnaireHistory /> },
  { path: '/mypage/questionnaire/reservation', element: <ReservationQuestionnaireHistory /> },
  { path: '/payment_history', element: <PaymentHistoryPage /> },
  { path: '/inquiry', element: <InquiryPage /> },
  { path: '/favorite', element: <FavoritePage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/payment/complete', element: <PaymentCompletePage /> },
  { path: '/payment/:id/cancel', element: <PaymentCancelPage /> },
  { path: '/payment/:id/cancel-detail', element: <PaymentCancelDetailPage /> },
  { path: '/payment/:id', element: <PaymentHistoryDetailPage /> },
  { path: '/payment/cancel/complete', element: <PaymentCancelCompletePage /> },
  { path: '/payment/failed', element: <PaymentFailedPage /> },
  { path: '/review', element: <ReviewPage /> },
  { path: '/review/form', element: <ReviewFormPage /> },
  { path: '/review/:reviewId', element: <ReviewDetailPage /> },
  { path: '/settings/notifications', element: <SettingsPage /> },
  { path: '/profile', element: <EditProfile /> },
  { path: '/profile/reset-password', element: <ProfileResetPassword /> },
  { path: '/profile/reset-password/complete', element: <ResetPasswordComplete /> },
  { path: '/profile/change-phone', element: <ProfileChangePhoneNumber /> },
  { path: '/profile/change-phone/callback', element: <ChangePhoneNumberCallback /> },
  { path: '/profile/withdrawal', element: <WithdrawalPage /> },
  { path: '/branch', element: <Branch /> },
  { path: '/branch/:id', element: <BranchDetail /> },
  { path: '/branch/search', element: <BranchSearch /> },
  { path: '/branch/location', element: <LocationSettings /> },
  { path: '/branch/location/picker', element: <LocationPickerMap /> },
  { path: '/branch/location/confirm', element: <AddressConfirm /> },
  { path: '/payment/callback', element: <PaymentCallbackPage /> },
  { path: '/brand/:brandCode/:brandName', element: <BrandDetailPage /> },
  { path: '/membership', element: <Membership /> },
  { path: '/store', element: <StorePage /> },
  { path: '/event', element: <EventPage /> },
  { path: '/event/:id', element: <EventDetailPage /> },
  { path: '/notice', element: <NoticePage /> },
  { path: '/notice/:id', element: <NoticeDetailPage /> },
  { path: '/signup/branch', element: <AddUsingBranch /> }
];

/**
 * 로그인 여부 미검증 페이지
 */
const noAuthRoutes: CustomRouteObject[] = [
  { path: '/dev', element: <Dev />, noAuth: true, isDev: true },
  { path: '/login', element: <Login />, noAuth: true },
  { path: '/login/email', element: <EmailLogin />, noAuth: true },
  { path: '/logout', element: <Logout />, noAuth: true },
  { path: '/oauth/callback/:provider', element: <OAuthCallback />, noAuth: true },
  { path: '/signup/terms', element: <TermsAgreement />, noAuth: true },
  { path: '/signup/email', element: <EmailPassword />, noAuth: true },
  { path: '/signup/profile', element: <ProfileSetup />, noAuth: true },
  { path: '/signup/callback', element: <SignupCallback />, noAuth: true },
  { path: '/signup/complete', element: <SignupComplete />, noAuth: true },
  { path: '/find-account', element: <FindAccount />, noAuth: true },
  { path: '/find-account/callback/:tab', element: <FindAccountCallback />, noAuth: true },
  { path: '/find-account/find-email', element: <FindEmail />, noAuth: true },
  { path: '/find-account/reset-password', element: <FindAccountResetPassword />, noAuth: true },
  { path: '/find-account/reset-password/complete', element: <ResetPasswordComplete />, noAuth: true },
  { path: '/terms', element: <TermsPage />, noAuth: true },
  { path: '/terms/:id', element: <TermsDetailPage />, noAuth: true }
];

export const routeConfig: CustomRouteObject[] = [...authRoutes, ...noAuthRoutes];
