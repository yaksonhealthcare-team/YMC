import { ConvertedMembershipForCardData, MembershipCard } from '@/_domain/membership';
import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Title } from '@/components/Title';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

interface MembershipCardSectionProps {
  memberships: ConvertedMembershipForCardData;
  isLoading: boolean;
  totalCount: number;
}

export const MembershipCardSection = ({ memberships, isLoading, totalCount }: MembershipCardSectionProps) => {
  const navigate = useNavigate();

  const handleCardClick = (membershipId: string) => {
    navigate(`/membership/usage/${membershipId}`, {
      state: { from: '/member-history/membership' }
    });
  };

  const handleClickReservation = (membershipId: string) => {
    navigate(`/reservation?membershipId=${membershipId}`);
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="min-h-[114px] flex items-center justify-center">
          <LoadingIndicator className="py-8" />
        </div>
      );
    if (memberships.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <EmptyCard
            title={`사용 가능한 회원권이 없어요.\n회원권 구매 후 예약이 가능해요.`}
            // button="회원권 구매하기"
            // onClick={() => navigate("/membership")}
          />
        </div>
      );
    }
    return (
      <Swiper spaceBetween={10} slidesPerView={1} style={{ overflow: 'visible' }} className="mt-2">
        {memberships.map((membership, idx) => {
          const key = `${membership.id}-${idx}`;
          const price = `${membership.remainAmount} / ${membership.totalAmount}`;

          return (
            <SwiperSlide key={key} className="mr-2">
              <MembershipCard
                title={membership.serviceName}
                date={membership.date}
                chips={membership.chips}
                content={price}
                onClick={() => handleCardClick(membership.id)}
                onClickReservation={() => handleClickReservation(membership.id)}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  };

  return (
    <div className="mt-6 px-5">
      <Title
        type="arrow"
        title="보유 회원권"
        count={`${totalCount}개`}
        onClick={() => navigate(`/member-history/membership`)}
      />
      {renderContent()}
    </div>
  );
};
