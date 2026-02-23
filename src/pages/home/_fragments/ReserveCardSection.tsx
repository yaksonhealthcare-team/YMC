import { useUserStore } from '@/_domain/auth';
import { useGetReservations } from '@/_domain/reservation';
import { EmptyCard } from '@/shared/ui/EmptyCard';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { ReserveCard } from '@/components/ReserveCard';
import { Title } from '@/shared/ui/Title';
import { useReservationStore } from '@/stores/reservationStore';
import { reservationFilters } from '@/entities/reservation/model/Reservation';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const ReserveCardSection = () => {
  const navigate = useNavigate();
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const { setFilter } = useReservationStore();
  const { data, isLoading } = useGetReservations(
    userId,
    { r_status: '001' },
    { refetchOnMount: 'always', refetchOnWindowFocus: 'always', staleTime: 0, initialPageParam: 1, enabled: !!userId }
  );

  const firstPage = data?.[0]?.data;
  const reservations = firstPage ?? { body: [], total_count: 0 };

  if (isLoading) {
    return <LoadingIndicator className="min-h-[114px] flex-1" />;
  }

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  const handleTitleClick = () => {
    // 방문예정 필터(001)를 선택하도록 설정
    const visitExpectedFilter = reservationFilters.find((filter) => filter.id === '001');
    if (visitExpectedFilter) {
      setFilter(visitExpectedFilter);
    }

    navigate('/member-history/reservation');
  };

  const hasReservations = reservations.body.length > 0;
  const totalCount = reservations.total_count || 0;

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
          {reservations.body.map((reservation, idx) => {
            const key = `${reservation.r_idx}-${idx}`;

            return (
              <SwiperSlide key={key}>
                <ReserveCard reservation={reservation} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default ReserveCardSection;
