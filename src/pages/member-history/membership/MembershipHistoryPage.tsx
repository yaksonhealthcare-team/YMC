import { useUserStore } from '@/features/auth/model/user.store';
import { convertMembershipForCard } from '@/features/membership-purchase/lib/membership.business';
import { useGetUserMemberships } from '@/features/membership-purchase/lib/membership.services';
import { MembershipStatusType } from '@/entities/membership/model/membership.types';
import { MembershipCard } from '@/widgets/membership-card/ui/MembershipCard';
import { useIntersectionObserver } from '@/shared/lib/hooks/useIntersectionObserver';
import { Loading } from '@/shared/ui/loading/Loading';
import { Button } from '@/shared/ui/button/Button';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useMembershipStore } from '@/features/membership-purchase/model/membershipStore';
import { MyMembershipFilterItem, myMembershipFilters } from '@/entities/membership/model/Membership';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainTabs from '../ui/MainTabs';

const MembershipContent = ({ filterId }: { filterId: string }) => {
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetUserMemberships(
    userId,
    { search_type: filterId === '-' ? '' : (filterId as MembershipStatusType) },
    { refetchOnMount: 'always', staleTime: 0, initialPageParam: 1, enabled: !!userId }
  );

  const handleNextFetch = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, handleNextFetch, { rootMargin: '200px' });

  const handleCardClick = (membershipId: string) => {
    navigate(`/membership/usage/${membershipId}`, {
      state: { from: '/member-history/membership' }
    });
  };

  useEffect(() => {
    setHeader({
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  const memberships = useMemo(() => data?.flatMap((page) => page.data.body) || [], [data]);
  const convertedMemberships = convertMembershipForCard(memberships);
  const hasMembership = memberships && memberships.length > 0;

  if (isLoading) return <Loading />;
  if (!hasMembership) return <div className="flex flex-1 justify-center items-center">회원권 내역이 없습니다.</div>;

  return (
    <div
      className="flex flex-col flex-1 px-5 pb-[100px] overflow-y-auto scrollbar-hide gap-3"
      key={`membership-content-${filterId}`}
    >
      {convertedMemberships.map((membership, idx) => {
        const key = `${membership.id}-${idx}`;
        const price = `${membership.remainAmount} / ${membership.totalAmount}`;

        return (
          <MembershipCard
            key={key}
            title={membership.serviceName}
            content={price}
            date={membership.date}
            chips={membership.chips}
            onClick={() => handleCardClick(membership.id)}
          />
        );
      })}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && <Loading />}
    </div>
  );
};

const FilterContent = ({
  membershipFilter,
  onFilterChange
}: {
  membershipFilter: MyMembershipFilterItem;
  onFilterChange: (filter: MyMembershipFilterItem) => void;
}) => {
  return (
    <div className="px-5 py-[16px] flex justify-center gap-2">
      {myMembershipFilters.map((filter) => {
        const isSelected = filter.id === membershipFilter.id;
        return (
          <Button
            key={filter.id}
            fullCustom
            className={clsx(
              'min-w-0 whitespace-nowrap px-[12px] py-[5px] text-14px !rounded-[15px]',
              isSelected
                ? 'bg-primary-50 text-primary border border-solid border-primary font-sb'
                : 'bg-white text-gray-500 border border-solid border-gray-200 font-r'
            )}
            onClick={() => onFilterChange(filter)}
          >
            {filter.title}
          </Button>
        );
      })}
    </div>
  );
};

const MembershipHistoryPage = () => {
  // const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout();
  const { filter: membershipFilter, setFilter: setMembershipFilter, resetFilter } = useMembershipStore();

  const handleFilterChange = useCallback(
    (filter: MyMembershipFilterItem) => {
      setMembershipFilter(filter);
    },
    [setMembershipFilter]
  );

  useEffect(() => {
    setHeader({
      display: false
    });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    return () => {
      resetFilter();
    };
  }, [resetFilter]);

  return (
    <div className="flex flex-col bg-system-bg min-h-[calc(100vh-82px)] h-screen">
      <div className="flex flex-col h-full">
        <div className="px-5">
          <MainTabs />
        </div>
        <FilterContent membershipFilter={membershipFilter} onFilterChange={handleFilterChange} />
        <MembershipContent filterId={membershipFilter.id} />
      </div>
    </div>
  );
};

export default MembershipHistoryPage;
