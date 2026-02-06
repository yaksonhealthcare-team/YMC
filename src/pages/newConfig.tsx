import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../_shared/router/home/HomePage'));
const Login = lazy(() => import('./login/Login'));
const WithdrawalPage = lazy(() => import('./profile/WithdrawalPage'));
const Membership = lazy(() => import('./membership/Membership'));
const MembershipBranchSelectPage = lazy(() => import('./membership/MembershipBranchSelectPage'));
const MyPage = lazy(() => import('./myPage/MyPage'));
const Logout = lazy(() => import('./logout/Logout'));
const Dev = lazy(() => import('./DevPage'));
const Notification = lazy(() => import('./home/Notification'));
const MembershipDetailPage = lazy(() => import('./membership/MembershipDetailPage'));
const EmailLogin = lazy(() => import('./login/EmailLogin'));
const TermsAgreement = lazy(() => import('./signup/TermsAgreement'));
const EmailPassword = lazy(() => import('./signup/EmailPassword'));
const ProfileSetup = lazy(() => import('./signup/ProfileSetup'));
const SignupComplete = lazy(() => import('./signup/SignupComplete'));
const PointPage = lazy(() => import('./point/PointPage'));
const Branch = lazy(() => import('./branch/Branch'));
const BranchDetail = lazy(() => import('./branch/[id]/BranchDetail'));
const FavoritePage = lazy(() => import('./favorite/FavoritePage'));
const PaymentHistoryPage = lazy(() => import('./payment/PaymentHistoryPage'));
const ReviewPage = lazy(() => import('./review/ReviewPage'));
const EventPage = lazy(() => import('./event/EventPage'));
const NoticePage = lazy(() => import('./notice/NoticePage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const EventDetailPage = lazy(() => import('./event/EventDetailPage'));
const NoticeDetailPage = lazy(() => import('./notice/NoticeDetail'));
const LocationSettings = lazy(() => import('./branch/_fragments/LocationSettings'));
const ReservationDetailPage = lazy(() => import('./reservation/ReservationDetailPage'));
const ReservationCancelPage = lazy(() => import('./reservation/ReservationCancelPage'));
const SatisfactionPage = lazy(() => import('./reservation/satisfaction/SatisfactionPage'));
const MembershipUsageHistory = lazy(() => import('./membership/MembershipUsageHistory'));
const ReservationPage = lazy(() => import('@/_shared/router/reservation/ReservationPage'));
const BranchSearch = lazy(() => import('./branch/search/BranchSearch'));
const ResetPasswordComplete = lazy(() => import('@/components/resetPassword/ResetPasswordComplete'));
const ReviewFormPage = lazy(() => import('./review/ReviewFormPage'));
const ReviewDetailPage = lazy(() => import('./review/ReviewDetailPage'));
const ActiveBranch = lazy(() => import('./myPage/activeBranch/ActiveBranch'));
const EditProfile = lazy(() => import('./editProfile/EditProfile'));
const Questionnaire = lazy(() => import('./questionnaire/Questionnaire'));
const QuestionnaireComplete = lazy(() => import('./questionnaire/QusetionnaireComplete'));
const GeneralQuestionnaireHistory = lazy(() => import('./myPage/questionnaire/GeneralQuestionnaireHistory'));
const ReservationQuestionnaireHistory = lazy(() => import('./myPage/questionnaire/ReservationQuestionnaireHistory'));
const FindAccount = lazy(() => import('./findAccount/FindAccount'));
const FindAccountCallback = lazy(() => import('./findAccount/FindAccountCallback'));
const FindEmail = lazy(() => import('./findAccount/FindEmail'));
const ProfileResetPassword = lazy(() => import('./editProfile/ProfileResetPassword'));
const FindAccountResetPassword = lazy(() => import('./findAccount/FindAccountResetPassword'));
const CartPage = lazy(() => import('./cart/CartPage'));
const TermsPage = lazy(() => import('../_shared/router/terms/TermsPage'));
const TermsDetailPage = lazy(() => import('../_shared/router/terms/TermsDetailPage'));
const PaymentPage = lazy(() => import('./payment/PaymentPage'));
const AddUsingBranch = lazy(() => import('./addUsingBranch/AddUsingBranch'));
const PaymentHistoryDetailPage = lazy(() => import('./payment/PaymentHistoryDetailPage'));
const PaymentCancelPage = lazy(() => import('./payment/PaymentCancelPage'));
const PaymentCancelCompletePage = lazy(() => import('./payment/PaymentCancelCompletePage'));
const PaymentCancelDetailPage = lazy(() => import('./payment/PaymentCancelDetailPage'));
const ReservationHistoryPage = lazy(() => import('./member-history/reservation/ReservationHistoryPage'));
const MembershipHistoryPage = lazy(() => import('./member-history/membership/MembershipHistoryPage'));
const ProfileChangePhoneNumber = lazy(() => import('./editProfile/ProfileChangePhoneNumber'));
const ChangePhoneNumberCallback = lazy(() => import('./editProfile/ChangePhoneNumberCallback'));
const PaymentCompletePage = lazy(() => import('./payment/PaymentCompletePage'));
const BrandDetailPage = lazy(() => import('./brand/BrandDetailPage'));
const OAuthCallback = lazy(() => import('../_shared/router/oauth/OAuthCallback'));
const LocationPickerMap = lazy(() => import('./branch/_fragments/LocationPickerMap'));
const AddressConfirm = lazy(() => import('./branch/_fragments/AddressConfirm'));
const SignupCallback = lazy(() => import('./signup/SignupCallback'));
const PaymentCallbackPage = lazy(() => import('./payment/PaymentCallbackPage'));
const PaymentFailedPage = lazy(() => import('./payment/PaymentFailedPage'));
const StorePage = lazy(() => import('./store/Store'));
const PopupDetailPage = lazy(() => import('./popup/PopupDetailPage'));

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
