import { useUserStore } from '@/_domain';
import {
  convertMembershipForCard,
  MembershipCard,
  MembershipCardProps,
  useGetUserMembershipDetail
} from '@/_domain/membership';
import { Loading } from '@/_shared';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import DateAndTime from '@/shared/ui/DateAndTime';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ReservationThumbnailProps {
  title: string;
  visit: string;
  date: Date;
  onClick: () => void;
}

const MembershipUsageHistory = () => {
  const { setHeader, setNavigation } = useLayout();
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserMembershipDetail(
    userId,
    { mp_idx: id },
    { enabled: !!id && !!userId, initialPageParam: 1 }
  );
  const membershipDetail = useMemo(() => data?.flatMap((page) => page.data.body) || [], [data]);
  const hasMembershipDetail = membershipDetail && membershipDetail.length > 0;

  useEffect(() => {
    setHeader({
      display: true,
      title: '회원권 이용내역',
      left: 'back'
    });
    setNavigation({
      display: true,
      activeTab: '예약/회원권'
    });
  }, [setHeader, setNavigation]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!hasMembershipDetail) {
    return (
      <div className="flex flex-1 items-center justify-center bg-system-bg">
        <p className="text-gray-500">내역이 없습니다.</p>
      </div>
    );
  }

  const [convertedMembershipDetail] = convertMembershipForCard(membershipDetail);

  const membershipCardProps: MembershipCardProps = {
    chips: convertedMembershipDetail.chips,
    content: `${convertedMembershipDetail.remainAmount} / ${convertedMembershipDetail.totalAmount}`,
    title: convertedMembershipDetail.serviceName,
    date: convertedMembershipDetail.date
  };

  const reservationsCount = membershipDetail[0].reservations?.length || 0;

  return (
    <div className="h-[calc(100vh-82px)] bg-system-bg overflow-y-auto">
      <div className="px-[20px] pt-[16px] pb-[100px]">
        <MembershipCard {...membershipCardProps} />
        <p className="mt-10 mb-4 text-sm font-sb">
          <span className="text-primary-300 ">{reservationsCount || 0}건</span>의 이용내역이 있습니다.
        </p>
        <div className="flex flex-col gap-3">
          {membershipDetail[0].reservations?.map((history) => (
            <ReservationThumbnail
              key={`history-${history.r_idx}`}
              title={history.ps_name}
              date={new Date(history.r_date)}
              onClick={() => navigate(`/reservation/${history.r_idx}`)}
              visit={history.visit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipUsageHistory;

const ReservationThumbnail = ({ title, visit, date, onClick }: ReservationThumbnailProps) => {
  return (
    <div
      className={
        'flex flex-col gap-[12px] justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]'
      }
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p className="font-sb">
          <span className="text-gray-700">{title}</span>
          <span className="text-gray-500 ml-1">{visit}회차</span>
        </p>
        <CaretRightIcon className="w-[16px] h-[16px]" />
      </div>
      <DateAndTime date={date} />
    </div>
  );
};
