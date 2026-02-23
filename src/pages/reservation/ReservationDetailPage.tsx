import { useUserStore } from '@/_domain/auth';
import { useGetReservationDetail } from '@/_domain/reservation';
import { Button } from '@/shared/ui/button/Button';
import FixedButtonContainer from '@/shared/ui/button/FixedButtonContainer';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { ReservationType } from '@/entities/reservation/model/Reservation';
import { Skeleton } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Location from './_fragments/Location';
import MembershipUsage from './_fragments/MembershipUsage';
import ReservationSummary from './_fragments/ReservationSummary';

const ReservationDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { getUserId } = useUserStore();
  const userId = getUserId();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setHeader, setNavigation } = useLayout();
  const { openBottomSheet, closeOverlay, overlayState } = useOverlay();

  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetReservationDetail(
    userId,
    { r_idx: id },
    { refetchOnMount: 'always', refetchOnWindowFocus: 'always', staleTime: 0, enabled: !!userId }
  );

  const reservation = useMemo(() => data?.body[0], [data]);

  useEffect(() => {
    setHeader({
      display: true,
      title: '예약 상세',
      left: 'back',
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: false });
  }, [navigate, setHeader, setNavigation]);

  // 오버레이 상태 감지
  useEffect(() => {
    if (overlayState.isOpen) {
      if (overlayState.type === 'bottomSheet') {
        setIsBottomSheetOpen(true);
      } else if (overlayState.type === 'modal') {
        setIsModalOpen(true);
      }
    } else {
      setIsBottomSheetOpen(false);
      setIsModalOpen(false);
    }
  }, [overlayState]);

  const handleCancelReservation = () => {
    if (!reservation) return;
    const { r_idx, r_date, b_name, ps_name } = reservation;

    openBottomSheet(
      <div className="flex flex-col">
        <p className="mx-5 mt-5 font-sb text-18px">취소하시겠습니까?</p>
        <p className="mx-5 mt-2 font-r text-16px text-gray-900">예약 취소 시 차감된 상담 횟수는 복원됩니다.</p>
        <div className="mt-10 border-t border-gray-50 flex gap-2 py-3 px-5">
          <Button className="w-full" variantType="line" onClick={closeOverlay}>
            돌아가기
          </Button>
          <Button
            className="w-full"
            variantType="primary"
            onClick={() => {
              navigate(`/reservation/${id}/cancel`, {
                replace: true,
                state: { r_idx, r_date, b_name, ps_name }
              });
              closeOverlay();
            }}
          >
            취소하기
          </Button>
        </div>
      </div>
    );
  };

  const handleNavigateToReservationForm = () => {
    if (!reservation) return;

    const { mp_idx, b_idx, remain_amount } = reservation;
    const params = new URLSearchParams();
    if (Number(mp_idx) !== -1 && Boolean(Number(remain_amount))) {
      params.append('membershipId', String(mp_idx));
    }
    if (b_idx != null && b_idx !== '') {
      params.append('branchId', String(b_idx));
    }

    const query = params.toString();
    navigate(`/reservation${query ? `?${query}` : ''}`);
  };

  const renderActionButtons = () => {
    if (!reservation) return null;

    const { r_date, r_take_time, r_status_code, review_positive_yn, r_idx, b_name, ps_name } = reservation;
    const now = new Date();

    // 원본 날짜를 복제하여 사용
    const reservationDate = new Date(r_date);

    // 날짜가 올바르게 파싱되었는지 확인 (예약 날짜가 유효한지)
    if (isNaN(reservationDate.getTime())) {
      console.error('예약 날짜가 유효하지 않습니다:', r_date);
      return null;
    }

    // 소요 시간을 파싱
    let hours = 0;
    let minutes = 0;
    if (r_take_time) {
      const durationParts = r_take_time.split(':');
      hours = parseInt(durationParts[0], 10) || 0;
      minutes = parseInt(durationParts[1], 10) || 0;
    }

    // 예약 종료 시간 계산 (별도의 변수로 저장)
    const reservationEndTime = new Date(reservationDate);
    reservationEndTime.setHours(reservationEndTime.getHours() + hours);
    reservationEndTime.setMinutes(reservationEndTime.getMinutes() + minutes);

    // 현재 시간이 예약 날짜(시작 시간)보다 이후인지 확인
    const isReservationDatePassed = now.getTime() > reservationDate.getTime();

    switch (r_status_code) {
      case '000': // 전체
      case '002': // 방문완료
        return (
          <div className="flex gap-[8px]">
            {review_positive_yn === 'Y' ? (
              <>
                <Button
                  variantType="line"
                  sizeType="l"
                  className={`flex-1 ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() =>
                    navigate(`/reservation/${id}/satisfaction`, {
                      state: {
                        r_idx,
                        r_date: new Date(r_date).toISOString(),
                        b_name,
                        ps_name,
                        review_items: [
                          { rs_idx: '1', rs_type: '시술만족도' },
                          { rs_idx: '2', rs_type: '친절도' },
                          { rs_idx: '3', rs_type: '청결도' }
                        ]
                      }
                    })
                  }
                  disabled={isModalOpen}
                >
                  만족도 작성
                </Button>
                <Button
                  variantType="primary"
                  sizeType="l"
                  className={`flex-1 ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNavigateToReservationForm}
                  disabled={isModalOpen}
                >
                  다시 예약하기
                </Button>
              </>
            ) : (
              <Button
                variantType="primary"
                sizeType="l"
                className={`w-full ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNavigateToReservationForm}
                disabled={isModalOpen}
              >
                다시 예약하기
              </Button>
            )}
          </div>
        );

      case '001': // 예약완료
        if (isReservationDatePassed) {
          return null; // 방문 완료 버튼 임시 숨김
        }
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className={`w-full ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleCancelReservation}
            disabled={isModalOpen}
          >
            예약 취소하기
          </Button>
        );

      case '008': // 관리중
        if (isReservationDatePassed) {
          return null; // 방문 완료 버튼 임시 숨김
        }
        return null;

      case '003': // 예약취소
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className={`w-full ${isModalOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNavigateToReservationForm}
            disabled={isModalOpen}
          >
            다시 예약하기
          </Button>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError)
    return (
      <div className="p-5 text-red-500">
        에러가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 에러'}
      </div>
    );
  if (!reservation) return <div className="p-5">예약 정보를 찾을 수 없습니다.</div>;

  const actionButtons = renderActionButtons();

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
      <ReservationSummary reservation={reservation} />
      <Location reservation={reservation} />
      <Divider className="my-[24px] border-gray-100" />
      {reservation.r_gubun === ReservationType.MANAGEMENT && (
        <MembershipUsage
          membershipName={reservation.s_name}
          branchName={reservation.b_name}
          remainAmount={reservation.remain_amount}
          totalAmount={reservation.buy_amount}
          membershipId={reservation.mp_idx}
          gubun={reservation.mp_gubun}
        />
      )}
      {!isBottomSheetOpen && actionButtons && (
        <FixedButtonContainer className="z-[200]">{actionButtons}</FixedButtonContainer>
      )}
    </div>
  );
};

export default ReservationDetailPage;

const LoadingSkeleton = () => (
  <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
    {/* 예약 정보 스켈레톤 */}
    <div className="flex flex-col gap-2">
      <Skeleton variant="rectangular" width={100} height={24} />
      <Skeleton variant="rectangular" width="100%" height={120} />
    </div>

    {/* 예약 문진 버튼 스켈레톤 */}
    <Skeleton variant="rectangular" width="100%" height={40} className="mt-[24px]" />

    {/* 위치 정보 스켈레톤 */}
    <div className="mt-[24px]">
      <Skeleton variant="rectangular" width={80} height={24} />
      <Skeleton variant="rectangular" width="100%" height={200} className="mt-[16px]" />
      <div className="mt-[16px] flex flex-col gap-[12px]">
        <Skeleton variant="rectangular" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </div>
    </div>

    <Divider className="my-[24px] border-gray-100" />

    {/* 회원권 정보 스켈레톤 */}
    <div className="flex flex-col gap-2">
      <Skeleton variant="rectangular" width={120} height={24} />
      <Skeleton variant="rectangular" width="100%" height={80} />
    </div>
  </div>
);
