import { UserSchema } from '@/_domain/auth';
import { BannerSchema, BannerSwiper, ContentsSchema, NotificationButton } from '@/_domain/contents';
import { TextSwiper } from '@/_shared';
import Logo from '@/assets/_icons/logo.svg?react';
import OverviewHeader from '@/assets/_icons/overview-header.svg?react';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface HomeOverviewProps {
  user: UserSchema | null;
  banners?: BannerSchema[];
  notices?: ContentsSchema[];
  notiCount: number;
}
const HomeOverview = ({ user, banners, notices, notiCount }: HomeOverviewProps) => {
  const hasBanners = banners && banners.length > 0;

  const handleClickBanner = useCallback((link: string) => {
    const url = link.startsWith('http') ? link : `https://${link}`;

    window.location.href = url;
  }, []);

  return (
    <div className={clsx('px-5 mb-6', 'drop-shadow-[0px_1px_4px_rgba(46,43,41,0.15)]')}>
      <OverviewHeader color="white" className="relative" />

      <div className="absolute flex flex-col justify-between w-full h-full top-0 left-0 px-5">
        <HeaderSection notices={notices} notiCount={notiCount} />
      </div>

      <div className="bg-white rounded-b-3xl px-5 -mt-1">
        <div className="pt-4 pb-5">
          <ContentsSection user={user} />
          {hasBanners && (
            <div className="mt-3">
              <BannerSwiper banners={banners} onClickBanner={handleClickBanner} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeOverview;

interface HeaderSectionProps {
  notices?: ContentsSchema[];
  notiCount: number;
}
const HeaderSection = ({ notices, notiCount }: HeaderSectionProps) => {
  const navigate = useNavigate();

  /**
   * TODO
   * [ ] notice page 리팩토링 이후에 state 제거
   */
  const handleClickNotice = useCallback(
    (notice: ContentsSchema) => {
      navigate(`/notice/${notice.code}`, { state: { from: '/' } });
    },
    [navigate]
  );

  const handleClickNotification = () => {
    navigate('/notification');
  };

  const hasNotices = notices && notices.length > 0;

  return (
    <div className="flex justify-between items-start w-full">
      <div className="flex flex-col px-5 pt-5 w-full">
        <Logo color="#231815" className="mb-3" />
        {hasNotices && (
          <TextSwiper onClick={handleClickNotice} contents={notices} className="text-gray-500 w-full h-5" />
        )}
      </div>

      <NotificationButton notiCount={notiCount} onClick={handleClickNotification} />
    </div>
  );
};

interface ContentsSectionProps {
  user: UserSchema | null;
}
const ContentsSection = ({ user }: ContentsSectionProps) => {
  const navigate = useNavigate();

  const userName = user?.name || '';
  const userLevel = user?.level_name || '';
  const userPoints = user?.points || '';

  const handleClick = () => {
    navigate('/reservation');
  };

  return (
    <div className="flex justify-between items-center bg-primary rounded-2xl p-4">
      <div className="flex gap-2 flex-col text-white">
        {user ? (
          <div className="flex flex-col">
            <div className="flex items-end mb-0.5">
              <p className="text-lg font-b mr-1">{userName}님</p>
              <p>반갑습니다.</p>
            </div>

            <div className="flex text-sm">
              <p className="mr-2 font-m">{userLevel}</p>
              <p className="font-b mr-0.5">{userPoints}</p>
              <p>P</p>
            </div>
          </div>
        ) : (
          <p className="font-m text-sm whitespace-pre-line">{`로그인하고 나만을 위한\n힐링을 시작해보세요!`}</p>
        )}
      </div>

      <button
        className="rounded-full bg-white text-primary-300 py-2 px-5 font-sb whitespace-nowrap text-14px"
        onClick={handleClick}
      >
        {user ? '예약하기' : '로그인하기'}
      </button>
    </div>
  );
};
