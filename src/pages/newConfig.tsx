import { RouteObject } from 'react-router-dom';
import { lazyWithRetry } from '@/_shared/utils/lazyWithRetry';

const Home = lazyWithRetry(() => import('../_shared/router/home/HomePage'));
const Login = lazyWithRetry(() => import('./login/Login'));
const WithdrawalPage = lazyWithRetry(() => import('./profile/WithdrawalPage'));
const Membership = lazyWithRetry(() => import('./membership/Membership'));
const MembershipBranchSelectPage = lazyWithRetry(() => import('./membership/MembershipBranchSelectPage'));
const MyPage = lazyWithRetry(() => import('./myPage/MyPage'));
const Logout = lazyWithRetry(() => import('./logout/Logout'));
const Dev = lazyWithRetry(() => import('./DevPage'));
const Notification = lazyWithRetry(() => import('./home/Notification'));
const MembershipDetailPage = lazyWithRetry(() => import('./membership/MembershipDetailPage'));
const EmailLogin = lazyWithRetry(() => import('./login/EmailLogin'));
const TermsAgreement = lazyWithRetry(() => import('./signup/TermsAgreement'));
const EmailPassword = lazyWithRetry(() => import('./signup/EmailPassword'));
const ProfileSetup = lazyWithRetry(() => import('./signup/ProfileSetup'));
const SignupComplete = lazyWithRetry(() => import('./signup/SignupComplete'));
const PointPage = lazyWithRetry(() => import('./point/PointPage'));
const Branch = lazyWithRetry(() => import('./branch/Branch'));
const BranchDetail = lazyWithRetry(() => import('./branch/[id]/BranchDetail'));
const FavoritePage = lazyWithRetry(() => import('./favorite/FavoritePage'));
const PaymentHistoryPage = lazyWithRetry(() => import('./payment/PaymentHistoryPage'));
const ReviewPage = lazyWithRetry(() => import('./review/ReviewPage'));
const EventPage = lazyWithRetry(() => import('./event/EventPage'));
const NoticePage = lazyWithRetry(() => import('./notice/NoticePage'));
const SettingsPage = lazyWithRetry(() => import('./settings/SettingsPage'));
const EventDetailPage = lazyWithRetry(() => import('./event/EventDetailPage'));
const NoticeDetailPage = lazyWithRetry(() => import('./notice/NoticeDetail'));
const LocationSettings = lazyWithRetry(() => import('./branch/_fragments/LocationSettings'));
const ReservationDetailPage = lazyWithRetry(() => import('./reservation/ReservationDetailPage'));
const ReservationCancelPage = lazyWithRetry(() => import('./reservation/ReservationCancelPage'));
const SatisfactionPage = lazyWithRetry(() => import('./reservation/satisfaction/SatisfactionPage'));
const MembershipUsageHistory = lazyWithRetry(() => import('./membership/MembershipUsageHistory'));
const ReservationPage = lazyWithRetry(() => import('@/_shared/router/reservation/ReservationPage'));
const BranchSearch = lazyWithRetry(() => import('./branch/search/BranchSearch'));
const ResetPasswordComplete = lazyWithRetry(() => import('@/components/resetPassword/ResetPasswordComplete'));
const ReviewFormPage = lazyWithRetry(() => import('./review/ReviewFormPage'));
const ReviewDetailPage = lazyWithRetry(() => import('./review/ReviewDetailPage'));
const ActiveBranch = lazyWithRetry(() => import('./myPage/activeBranch/ActiveBranch'));
const EditProfile = lazyWithRetry(() => import('./editProfile/EditProfile'));
const Questionnaire = lazyWithRetry(() => import('./questionnaire/Questionnaire'));
const QuestionnaireComplete = lazyWithRetry(() => import('./questionnaire/QusetionnaireComplete'));
const GeneralQuestionnaireHistory = lazyWithRetry(() => import('./myPage/questionnaire/GeneralQuestionnaireHistory'));
const ReservationQuestionnaireHistory = lazyWithRetry(() => import('./myPage/questionnaire/ReservationQuestionnaireHistory'));
const FindAccount = lazyWithRetry(() => import('./findAccount/FindAccount'));
const FindAccountCallback = lazyWithRetry(() => import('./findAccount/FindAccountCallback'));
const FindEmail = lazyWithRetry(() => import('./findAccount/FindEmail'));
const ProfileResetPassword = lazyWithRetry(() => import('./editProfile/ProfileResetPassword'));
const FindAccountResetPassword = lazyWithRetry(() => import('./findAccount/FindAccountResetPassword'));
const CartPage = lazyWithRetry(() => import('./cart/CartPage'));
const TermsPage = lazyWithRetry(() => import('../_shared/router/terms/TermsPage'));
const TermsDetailPage = lazyWithRetry(() => import('../_shared/router/terms/TermsDetailPage'));
const PaymentPage = lazyWithRetry(() => import('./payment/PaymentPage'));
const AddUsingBranch = lazyWithRetry(() => import('./addUsingBranch/AddUsingBranch'));
const PaymentHistoryDetailPage = lazyWithRetry(() => import('./payment/PaymentHistoryDetailPage'));
const PaymentCancelPage = lazyWithRetry(() => import('./payment/PaymentCancelPage'));
const PaymentCancelCompletePage = lazyWithRetry(() => import('./payment/PaymentCancelCompletePage'));
const PaymentCancelDetailPage = lazyWithRetry(() => import('./payment/PaymentCancelDetailPage'));
const ReservationHistoryPage = lazyWithRetry(() => import('./member-history/reservation/ReservationHistoryPage'));
const MembershipHistoryPage = lazyWithRetry(() => import('./member-history/membership/MembershipHistoryPage'));
const ProfileChangePhoneNumber = lazyWithRetry(() => import('./editProfile/ProfileChangePhoneNumber'));
const ChangePhoneNumberCallback = lazyWithRetry(() => import('./editProfile/ChangePhoneNumberCallback'));
const PaymentCompletePage = lazyWithRetry(() => import('./payment/PaymentCompletePage'));
const BrandDetailPage = lazyWithRetry(() => import('./brand/BrandDetailPage'));
const OAuthCallback = lazyWithRetry(() => import('../_shared/router/oauth/OAuthCallback'));
const LocationPickerMap = lazyWithRetry(() => import('./branch/_fragments/LocationPickerMap'));
const AddressConfirm = lazyWithRetry(() => import('./branch/_fragments/AddressConfirm'));
const SignupCallback = lazyWithRetry(() => import('./signup/SignupCallback'));
const PaymentCallbackPage = lazyWithRetry(() => import('./payment/PaymentCallbackPage'));
const PaymentFailedPage = lazyWithRetry(() => import('./payment/PaymentFailedPage'));
const StorePage = lazyWithRetry(() => import('./store/Store'));
const PopupDetailPage = lazyWithRetry(() => import('./popup/PopupDetailPage'));

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
