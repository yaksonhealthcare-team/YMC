import {
  convertMembershipForCard,
  HomeOverview,
  useGetBanners,
  useGetContents,
  useGetUserMemberships,
  useUserStore
} from '@/_domain';
import { useGetUnreadCount } from '@/_shared/services';
import { FloatingButton } from '@/components/FloatingButton';
import { BrandSection } from '@/pages/home/_fragments/BrandSection';
import { BusinessInfo } from '@/pages/home/_fragments/BusinessInfo';
import { EventSection } from '@/pages/home/_fragments/EventSection';
import { MembershipCardSection } from '@/pages/home/_fragments/MembershipCardSection';
import ReserveCardSection from '@/pages/home/_fragments/ReserveCardSection';
import { useStartupPopups } from '@/queries/useContentQueries';
import { useLayout } from '@/stores/LayoutContext';
import { usePopupActions } from '@/stores/popupStore';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, getUserId: getUserKey } = useUserStore();
  const userId = getUserKey();
  const { openPopup } = usePopupActions();
  const enabled = !!userId;

  const { data: unreadCountData } = useGetUnreadCount(userId, {
    enabled,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 0
  });
  const { data: membershipData, isLoading: isMembershipLoading } = useGetUserMemberships(
    userId,
    { search_type: 'T' },
    { enabled, initialPageParam: 1 }
  );
  const { data: bannersData } = useGetBanners(userId, { gubun: 'S01', area01: 'Y', area02: 'Y' }, { enabled });
  const { data: noticesData } = useGetContents(userId, { gubun: 'N01' }, { enabled, initialPageParam: 1 });
  const { data: popupData } = useStartupPopups({ enabled: !!user });

  const handleClickBranch = () => {
    navigate('/branch');
  };

  const memberships = useMemo(() => membershipData?.flatMap((page) => page.data.body) || [], [membershipData]);
  const convertedMemberships = convertMembershipForCard(memberships);
  const totalCount = useMemo(() => membershipData?.[0]?.data?.total_count || 0, [membershipData]);
  const notiCount = useMemo(
    () => Number(unreadCountData?.data.body.unread_count) || 0,
    [unreadCountData?.data.body.unread_count]
  );
  const banners = useMemo(
    () => (bannersData?.data.use ? bannersData.data.body : undefined),
    [bannersData?.data.body, bannersData?.data.use]
  );
  const notices = useMemo(() => noticesData?.flatMap((page) => page.data.body) || [], [noticesData]);

  const hasMembership = memberships && memberships.length > 0;

  useEffect(() => {
    if (popupData && popupData.length > 0) {
      openPopup(popupData);
    }
  }, [popupData, openPopup]);

  return (
    <>
      <Header />

      <div className="w-full bg-system-bg h-full">
        <div className="relative pt-7">
          <HomeOverview user={user} banners={banners} notices={notices} notiCount={notiCount} />
          <ReserveCardSection />
          <MembershipCardSection
            memberships={hasMembership ? convertedMemberships : []}
            isLoading={isMembershipLoading}
            totalCount={totalCount}
          />
          <BrandSection />
          <EventSection />
          <BusinessInfo />

          <FloatingButton type="search" onClick={handleClickBranch} />
        </div>
      </div>
    </>
  );
};

export default HomePage;

const Header = () => {
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  return null;
};
