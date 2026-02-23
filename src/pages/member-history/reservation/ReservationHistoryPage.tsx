import { useUserStore } from '@/_domain/auth';
import { useGetReservations } from '@/_domain/reservation';
import { Loading, useIntersectionObserver } from '@/_shared';
import ReservationIcon from '@/assets/icons/ReservationIcon.svg?react';
import { Button } from '@/shared/ui/button/Button';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { ReserveCard } from '@/entities/reservation/ui/ReserveCard';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useReservationStore } from '@/features/reservation/model/reservationStore';
import { FilterItem, reservationFilters, ReservationStatusCode } from '@/entities/reservation/model/Reservation';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainTabs from '../ui/MainTabs';

const ReservationContent = ({ filterId }: { filterId: ReservationStatusCode }) => {
  const { user } = useUserStore();
  const { data, isPending, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetReservations(
    user?.hp || '',
    { r_status: filterId },
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      staleTime: 0,
      initialPageParam: 1,
      enabled: !!user
    }
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleNextFetch = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, handleNextFetch, { rootMargin: '200px' });

  const reservations = useMemo(() => data?.flatMap((page) => page.data.body) ?? [], [data]);
  const hasReservation = reservations && reservations.length > 0;

  if (isPending || isRefetching) return <Loading />;
  if (!hasReservation) return <div className="flex justify-center items-center p-4">예약 내역이 없습니다.</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide" key={`reservation-content-${filterId}`}>
      <div className="px-5">
        {reservations.map((reservation, idx) => {
          const key = `${reservation.r_idx}-${idx}`;

          return (
            <div className="pb-[12px]" key={key}>
              <ReserveCard reservation={reservation} />
            </div>
          );
        })}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <LoadingIndicator className="w-6 h-6" />
          </div>
        )}

        <div ref={loadMoreRef} />
      </div>
    </div>
  );
};

const FilterContent = ({
  reservationFilter,
  onFilterChange
}: {
  reservationFilter: FilterItem;
  onFilterChange: (filter: FilterItem) => void;
}) => {
  return (
    <div className="px-5 py-[16px] flex justify-center gap-2">
      {reservationFilters.map((filter) => {
        const isSelected = filter.id === reservationFilter.id;
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

const ReservationHistoryPage = () => {
  const navigate = useNavigate();
  const { setHeader, setNavigation } = useLayout();
  const { filter: reservationFilter, setFilter: setReservationFilter, resetFilter } = useReservationStore();

  const handleFilterChange = useCallback(
    (filter: FilterItem) => {
      setReservationFilter(filter);
    },
    [setReservationFilter]
  );

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    return () => {
      resetFilter();
    };
  }, [resetFilter]);

  return (
    <div className="flex flex-col bg-system-bg min-h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="px-5">
          <MainTabs />
        </div>

        <FilterContent reservationFilter={reservationFilter} onFilterChange={handleFilterChange} />

        <ReservationContent filterId={reservationFilter.id} />
      </div>
      <button
        className="fixed bottom-[98px] right-5 w-14 h-14 bg-primary-300 text-white rounded-full shadow-lg hover:bg-primary-400  transition-colors duration-200 z-10"
        onClick={handleReservationClick}
      >
        <ReservationIcon className="w-8 h-8 mx-auto text-white" />
      </button>
    </div>
  );
};

export default ReservationHistoryPage;
