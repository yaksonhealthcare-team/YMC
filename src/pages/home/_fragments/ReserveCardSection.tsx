import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { ReserveCard } from '@/components/ReserveCard';
import { Title } from '@/components/Title';
import { useUpcomingReservations } from '@/queries/useReservationQueries';
import { useReservationStore } from '@/stores/reservationStore';
import { reservationFilters } from '@/types/Reservation';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const ReserveCardSection = () => {
  const navigate = useNavigate();
  const { data: upcomingReservations, isLoading } = useUpcomingReservations();
  const { setFilter } = useReservationStore();

  // 예약이 있는지 여부와 총 예약 수를 미리 계산
  const { hasReservations, totalCount } = useMemo(() => {
    const reservations = upcomingReservations?.reservations || [];
    return {
      hasReservations: reservations.length > 0,
      totalCount: upcomingReservations?.total_count || 0
    };
  }, [upcomingReservations]);

  if (isLoading) {
    return <LoadingIndicator className="min-h-[114px] flex-1" />;
  }

  const handleReservationClick = () => {
    navigate('/reservation/form', {
      state: {
        originalPath: '/',
        fromHome: true
      }
    });
  };

  const handleTitleClick = () => {
    // 방문예정 필터(001)를 선택하도록 설정
    const visitExpectedFilter = reservationFilters.find((filter) => filter.id === '001');
    if (visitExpectedFilter) {
      setFilter(visitExpectedFilter);
    }

    navigate('/member-history/reservation');
  };

  return (
    <div className="mt-6 px-5">
      <Title type="arrow" title="예정된 예약" count={`${totalCount || 0}건`} onClick={handleTitleClick} />
      {!hasReservations ? (
        <EmptyCard
          title={`예정된 예약이 없어요.\n예약을 통해 관리를 받아보세요.`}
          button="예약하러 가기"
          onClick={handleReservationClick}
        />
      ) : (
        <Swiper spaceBetween={10} slidesPerView={1} style={{ overflow: 'visible' }} className="mt-2">
          {upcomingReservations?.reservations?.map((reservation) => (
            <SwiperSlide key={reservation.id}>
              <ReserveCard reservation={reservation} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ReserveCardSection;
