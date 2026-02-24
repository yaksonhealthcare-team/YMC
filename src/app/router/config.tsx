import { RouteObject } from 'react-router-dom';
import { lazyWithRetry } from '@/shared/lib/utils/lazyWithRetry';

const Home = lazyWithRetry(() => import('@/pages/home/HomePage'));
const Login = lazyWithRetry(() => import('@/pages/login/Login'));
const WithdrawalPage = lazyWithRetry(() => import('@/pages/profile/WithdrawalPage'));
const Membership = lazyWithRetry(() => import('@/pages/membership/Membership'));
const MembershipBranchSelectPage = lazyWithRetry(() => import('@/pages/membership/MembershipBranchSelectPage'));
const MyPage = lazyWithRetry(() => import('@/pages/myPage/MyPage'));
const Logout = lazyWithRetry(() => import('@/pages/logout/Logout'));
const Notification = lazyWithRetry(() => import('@/pages/home/Notification'));
const MembershipDetailPage = lazyWithRetry(() => import('@/pages/membership/MembershipDetailPage'));
const EmailLogin = lazyWithRetry(() => import('@/pages/login/EmailLogin'));
const TermsAgreement = lazyWithRetry(() => import('@/pages/signup/TermsAgreement'));
const EmailPassword = lazyWithRetry(() => import('@/pages/signup/EmailPassword'));
const ProfileSetup = lazyWithRetry(() => import('@/pages/signup/ProfileSetup'));
const SignupComplete = lazyWithRetry(() => import('@/pages/signup/SignupComplete'));
const PointPage = lazyWithRetry(() => import('@/pages/point/PointPage'));
const Branch = lazyWithRetry(() => import('@/pages/branch/Branch'));
const BranchDetail = lazyWithRetry(() => import('@/pages/branch/[id]/BranchDetail'));
const FavoritePage = lazyWithRetry(() => import('@/pages/favorite/FavoritePage'));
const PaymentHistoryPage = lazyWithRetry(() => import('@/pages/payment/PaymentHistoryPage'));
const ReviewPage = lazyWithRetry(() => import('@/pages/review/ReviewPage'));
const EventPage = lazyWithRetry(() => import('@/pages/event/EventPage'));
const NoticePage = lazyWithRetry(() => import('@/pages/notice/NoticePage'));
const SettingsPage = lazyWithRetry(() => import('@/pages/settings/SettingsPage'));
const EventDetailPage = lazyWithRetry(() => import('@/pages/event/EventDetailPage'));
const NoticeDetailPage = lazyWithRetry(() => import('@/pages/notice/NoticeDetail'));
const LocationSettings = lazyWithRetry(() => import('@/pages/branch/ui/LocationSettings'));
const ReservationDetailPage = lazyWithRetry(() => import('@/pages/reservation/ReservationDetailPage'));
const ReservationCancelPage = lazyWithRetry(() => import('@/pages/reservation/ReservationCancelPage'));
const SatisfactionPage = lazyWithRetry(() => import('@/pages/reservation/satisfaction/SatisfactionPage'));
const MembershipUsageHistory = lazyWithRetry(() => import('@/pages/membership/MembershipUsageHistory'));
const ReservationPage = lazyWithRetry(() => import('@/pages/reservation/ReservationPage'));
const BranchSearch = lazyWithRetry(() => import('@/pages/branch/search/BranchSearch'));
const ResetPasswordComplete = lazyWithRetry(() => import('@/features/auth/ui/resetPassword/ResetPasswordComplete'));
const ReviewFormPage = lazyWithRetry(() => import('@/pages/review/ReviewFormPage'));
const ReviewDetailPage = lazyWithRetry(() => import('@/pages/review/ReviewDetailPage'));
const ActiveBranch = lazyWithRetry(() => import('@/pages/myPage/activeBranch/ActiveBranch'));
const EditProfile = lazyWithRetry(() => import('@/pages/editProfile/EditProfile'));
const Questionnaire = lazyWithRetry(() => import('@/pages/questionnaire/Questionnaire'));
const QuestionnaireComplete = lazyWithRetry(() => import('@/pages/questionnaire/QusetionnaireComplete'));
const GeneralQuestionnaireHistory = lazyWithRetry(() => import('@/pages/myPage/questionnaire/GeneralQuestionnaireHistory'));
const ReservationQuestionnaireHistory = lazyWithRetry(() => import('@/pages/myPage/questionnaire/ReservationQuestionnaireHistory'));
const FindAccount = lazyWithRetry(() => import('@/pages/findAccount/FindAccount'));
const FindAccountCallback = lazyWithRetry(() => import('@/pages/findAccount/FindAccountCallback'));
const FindEmail = lazyWithRetry(() => import('@/pages/findAccount/FindEmail'));
const ProfileResetPassword = lazyWithRetry(() => import('@/pages/editProfile/ProfileResetPassword'));
const FindAccountResetPassword = lazyWithRetry(() => import('@/pages/findAccount/FindAccountResetPassword'));
const CartPage = lazyWithRetry(() => import('@/pages/cart/CartPage'));
const TermsPage = lazyWithRetry(() => import('@/pages/terms/TermsPage'));
const TermsDetailPage = lazyWithRetry(() => import('@/pages/terms/TermsDetailPage'));
const PaymentPage = lazyWithRetry(() => import('@/pages/payment/PaymentPage'));
const AddUsingBranch = lazyWithRetry(() => import('@/pages/addUsingBranch/AddUsingBranch'));
const PaymentHistoryDetailPage = lazyWithRetry(() => import('@/pages/payment/PaymentHistoryDetailPage'));
const PaymentCancelPage = lazyWithRetry(() => import('@/pages/payment/PaymentCancelPage'));
const PaymentCancelCompletePage = lazyWithRetry(() => import('@/pages/payment/PaymentCancelCompletePage'));
const PaymentCancelDetailPage = lazyWithRetry(() => import('@/pages/payment/PaymentCancelDetailPage'));
const ReservationHistoryPage = lazyWithRetry(() => import('@/pages/member-history/reservation/ReservationHistoryPage'));
const MembershipHistoryPage = lazyWithRetry(() => import('@/pages/member-history/membership/MembershipHistoryPage'));
const ProfileChangePhoneNumber = lazyWithRetry(() => import('@/pages/editProfile/ProfileChangePhoneNumber'));
const ChangePhoneNumberCallback = lazyWithRetry(() => import('@/pages/editProfile/ChangePhoneNumberCallback'));
const PaymentCompletePage = lazyWithRetry(() => import('@/pages/payment/PaymentCompletePage'));
const BrandDetailPage = lazyWithRetry(() => import('@/pages/brand/BrandDetailPage'));
const OAuthCallback = lazyWithRetry(() => import('@/pages/oauth/OAuthCallback'));
const LocationPickerMap = lazyWithRetry(() => import('@/pages/branch/ui/LocationPickerMap'));
const AddressConfirm = lazyWithRetry(() => import('@/pages/branch/ui/AddressConfirm'));
const SignupCallback = lazyWithRetry(() => import('@/pages/signup/SignupCallback'));
const PaymentCallbackPage = lazyWithRetry(() => import('@/pages/payment/PaymentCallbackPage'));
const PaymentFailedPage = lazyWithRetry(() => import('@/pages/payment/PaymentFailedPage'));
const StorePage = lazyWithRetry(() => import('@/pages/store/Store'));
const PopupDetailPage = lazyWithRetry(() => import('@/pages/popup/PopupDetailPage'));

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
