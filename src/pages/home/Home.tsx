import { useUserStore } from '@/_domain/auth';
import { convertMembershipForCard, useGetUserMemberships } from '@/_domain/membership';
import '@/assets/css/swiper-custom.css';
import NotiIcon from '@/assets/icons/NotiIcon.svg?react';
import { FloatingButton } from '@/shared/ui/button/FloatingButton';
import Logo from '@/shared/ui/layout/Logo';
import NoticesSummarySlider from '@/widgets/notices-slider/ui/NoticesSummarySlider';
import { useBanner } from '@/entities/banner/api/useBannerQueries';
import { useUnreadNotificationsCount } from '@/entities/notification/api/useNotificationQueries';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { BannerRequestType } from '@/entities/banner/model/Banner';
import { Container, Typography } from '@mui/material';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import DynamicHomeHeaderBackground from './_fragments/DynamicHomeHeaderBackground';
import { MembershipCardSection } from './_fragments/MembershipCardSection';
import ReserveCardSection from './_fragments/ReserveCardSection';

// 단일 코드 청크로 그룹화하여 불필요한 네트워크 요청 줄이기
const SecondaryContentChunk = lazy(
  () => import(/* webpackChunkName: "home-secondary" */ './_fragments/SecondaryContentChunk')
);

const Home = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const { data: mainBanner } = useBanner(
    { gubun: BannerRequestType.SLIDE, area01: 'Y', area02: 'Y' },
    { enabled: !!user }
  );
  const { data: unreadCount = 0 } = useUnreadNotificationsCount(user);
  const { data, isLoading: isMembershipLoading } = useGetUserMemberships(
    user?.hp || '',
    { search_type: 'T' },
    { enabled: !!user, initialPageParam: 1 }
  );
  const memberships = useMemo(() => data?.flatMap((page) => page.data.body) || [], [data]);
  const totalCount = data?.[0]?.data?.total_count || 0;
  const convertedMemberships = convertMembershipForCard(memberships);
  const hasMembership = memberships && memberships.length > 0;

  const getDisplayCount = (count: number) => {
    if (count > 99) return '99+';
    return count;
  };

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  const handleReservationClick = () => {
    if (!user) {
      navigate('/login', {
        replace: true
      });

      return;
    }

    navigate('/reservation');
  };

  return (
    <div className="w-full bg-system-bg h-full">
      <Container className="relative pt-4 px-0 max-w-screen overflow-hidden">
        <DynamicHomeHeaderBackground
          header={
            <div className={'space-y-2'}>
              <Logo text size={136} />
              <NoticesSummarySlider
                className={'h-[21px] mt-[12px] max-w-[90%] text-gray-500'}
                fromPath="/"
                left={<span className="min-w-[40px]">[공지]</span>}
              />
            </div>
          }
          contents={[
            <div key="user-info" className="flex justify-between items-center bg-primary-300 rounded-2xl p-4">
              <div className="flex gap-2 flex-col text-white">
                <div className="max-[370px]:hidden flex">
                  <Typography>
                    <span className={'text-18px font-b'}>{user ? `${user?.name}님 ` : ''}</span>
                    반갑습니다.
                  </Typography>
                </div>
                <div className="max-[370px]:flex hidden">
                  <Typography>
                    <span className={'text-18px font-b'}>{user?.name}님</span> <br />
                    반갑습니다.
                  </Typography>
                </div>
                <Typography className="font-m text-14px">
                  {user ? (
                    <>
                      <span className="mr-2">{user?.level_name}</span>{' '}
                      <span className="font-b mr-[2px]">{user?.points}</span>
                      <span>P</span>
                    </>
                  ) : (
                    <span>로그인 후 이용 가능합니다.</span>
                  )}
                </Typography>
              </div>
              <button
                className="rounded-full bg-white text-primary-300 py-2 px-5 font-sb whitespace-nowrap text-14px"
                onClick={handleReservationClick}
                aria-label="예약하기"
              >
                예약하기
              </button>
            </div>,
            mainBanner?.[0]?.isVisible && (
              <div key="banner" className="mt-3">
                <Swiper
                  modules={[Pagination]}
                  pagination={{
                    clickable: true
                  }}
                  slidesPerView={1}
                  className="w-full aspect-[8/5] rounded-2xl"
                  loop={true}
                >
                  {mainBanner?.map((banner) => {
                    const getBannerLink = (link: string) => {
                      if (link.startsWith('http')) return link;
                      return `https://${link}`;
                    };

                    return (
                      <SwiperSlide key={banner.code}>
                        <button
                          className="w-full"
                          onClick={() => {
                            window.location.href = getBannerLink(banner.link) || '/membership';
                          }}
                          aria-label={banner.title}
                        >
                          <img
                            src={banner.fileUrl}
                            alt={banner.title}
                            className="object-cover rounded-2xl"
                            width="100%"
                            height="auto"
                          />
                        </button>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )
          ]}
          buttonArea={
            <div className="relative">
              <button
                className="w-11 h-11 bg-primary-300 text-white rounded-full shadow-lg flex justify-center items-center relative hover:bg-primary-400 transition-colors duration-200"
                onClick={() => navigate('/notification')}
                aria-label={`알림${unreadCount > 0 ? `, ${unreadCount}개의 새로운 알림이 있습니다` : ''}`}
                aria-live="polite"
                aria-atomic="true"
              >
                <NotiIcon className="text-white w-6 h-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <div
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white border border-primary rounded-full flex items-center justify-center px-1"
                    role="status"
                    aria-label={`${unreadCount}개의 새로운 알림`}
                  >
                    <span className="text-primary text-[10px] leading-none font-m" aria-hidden="true">
                      {getDisplayCount(unreadCount)}
                    </span>
                  </div>
                )}
              </button>
            </div>
          }
        />

        {/* 주요 섹션은 즉시 로드 */}
        <ReserveCardSection />
        <MembershipCardSection
          memberships={hasMembership ? convertedMemberships : []}
          isLoading={isMembershipLoading}
          totalCount={totalCount}
        />

        {/* 화면 아래 컴포넌트는 지연 로드 */}
        <Suspense
          fallback={<div className="skeleton-loader h-[300px] w-full animate-pulse bg-gray-200 rounded-lg my-4"></div>}
        >
          <SecondaryContentChunk />
        </Suspense>
      </Container>
      <FloatingButton
        type="search"
        onClick={() => {
          navigate('/branch');
        }}
        aria-label="지점 검색하기"
      />
    </div>
  );
};

export default Home;
