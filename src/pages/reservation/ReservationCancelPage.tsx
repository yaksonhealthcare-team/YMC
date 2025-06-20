import { Button } from '@/components/Button';
import FixedButtonContainer from '@/components/FixedButtonContainer';
import LoadingIndicator from '@/components/LoadingIndicator';
import { TextArea } from '@/components/TextArea';
import { useLayout } from '@/contexts/LayoutContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useReservationGuideMessages } from '@/hooks/useGuideMessages';
import { useCancelReservation, useReservationDetail } from '@/queries/useReservationQueries';
import { escapeHtml } from '@/utils/sanitize';
import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReservationCancelBottomSheetContent from './_fragments/ReservationCancelBottomSheetContent';

interface ReservationDetailView {
  branchName: string;
  programName: string;
  duration: string;
  additionalServices: string[];
  totalPrice: number;
  request?: string;
}

const ReservationCancelPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { setHeader, setNavigation } = useLayout();
  const { showToast, openBottomSheet } = useOverlay();
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservation, setReservation] = useState<ReservationDetailView | null>(null);
  const { mutate: cancelReservation } = useCancelReservation();
  const { data: reservationDetail, isLoading: isDetailLoading } = useReservationDetail(id ?? '');
  const { reservationCancelMessage, isLoading: isGuideMessageLoading } = useReservationGuideMessages();

  useEffect(() => {
    setHeader({
      display: true,
      title: '예약 취소',
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, [id]);

  useEffect(() => {
    if (reservationDetail) {
      const totalPrice = (reservationDetail.additionalServices || []).reduce(
        (sum: number, service) => sum + service.price,
        0
      );

      setReservation({
        branchName: reservationDetail.branchName,
        programName: reservationDetail.programName,
        duration: reservationDetail.duration || '00:00',
        additionalServices: reservationDetail.additionalServices?.map((service) => service.name) || [],
        totalPrice,
        request: reservationDetail.request
      });
    }
  }, [reservationDetail?.id]);

  const handleConfirmCancel = async () => {
    try {
      setIsLoading(true);
      if (id) {
        // 취소 사유 이스케이프 처리
        const sanitizedReason = escapeHtml(cancelReason);

        cancelReservation(
          {
            reservationId: id,
            cancelMemo: sanitizedReason
          },
          {
            onSuccess: (response) => {
              // 바텀시트 닫기
              const closeOverlay = document.querySelector('[aria-label="close"]');
              if (closeOverlay instanceof HTMLElement) {
                closeOverlay.click();
              }

              if (response.resultCode === '00') {
                showToast('예약이 취소되었습니다');
                // 예약 상세 페이지로 이동하기 전에 약간의 지연을 줌
                setTimeout(() => {
                  navigate(`/reservation/${id}`, { replace: true });
                }, 100);
              } else {
                showToast(response.resultMessage || '예약 취소에 실패했습니다');
              }
            },
            onError: (error) => {
              console.error('예약 취소 실패:', error);
              showToast('예약 취소에 실패했습니다');
            },
            onSettled: () => {
              setIsLoading(false);
            }
          }
        );
      }
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
      showToast('예약 취소에 실패했습니다');
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (cancelReason.length < 5) {
      showToast('취소 사유를 5자 이상 입력해주세요.');
      return;
    }

    openBottomSheet(
      <ReservationCancelBottomSheetContent
        onConfirm={() => {
          // 바텀시트 먼저 닫기
          const closeOverlay = document.querySelector('[aria-label="close"]');
          if (closeOverlay instanceof HTMLElement) {
            closeOverlay.click();
          }
          // 그 다음 취소 처리
          handleConfirmCancel();
        }}
      />
    );
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCancelReason(e.target.value);
  };

  if (isDetailLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  return (
    <div className="w-full flex flex-col pb-[120px]">
      <div className="w-full px-[20px] pt-[16px] pb-[24px] flex flex-col gap-5">
        <h2 className="font-b text-18px text-gray-700">{reservation?.branchName}</h2>

        <Divider className="my-[24px] border-gray-100" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">관리 프로그램</span>
            <span className="font-r text-14px text-gray-700">{reservation?.programName}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">소요시간</span>
            <span className="font-r text-14px text-gray-700">{reservation?.duration}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">추가관리</span>
            <span className="font-r text-14px text-gray-700">{reservation?.additionalServices.join(' / ')}</span>
            <span className="font-sb text-14px text-gray-700">총 {reservation?.totalPrice.toLocaleString()}원</span>
          </div>

          {reservation?.request && (
            <div className="flex flex-col gap-1.5">
              <span className="font-sb text-14px text-gray-500">요청사항</span>
              <span className="font-r text-14px text-gray-700">{reservation?.request}</span>
            </div>
          )}
        </div>
      </div>

      <Divider className="my-[24px] border-gray-50 border-b-[8px]" />

      <div className="flex flex-col gap-3 px-[20px] py-[24px]">
        <h3 className="font-sb text-16px text-gray-700">취소 사유</h3>
        <TextArea
          placeholder="취소 사유를 입력해주세요"
          value={cancelReason}
          onChange={handleTextAreaChange}
          maxLength={100}
          helperText={cancelReason.length > 0 && cancelReason.length < 5 ? '5자 이상 작성해주세요.' : ''}
          error={cancelReason.length > 0 && cancelReason.length < 5}
        />
      </div>

      {!isGuideMessageLoading && reservationCancelMessage && (
        <div className="flex gap-1 px-[20px] pb-[40px]">
          <p className="font-r text-14px text-gray-500">{reservationCancelMessage}</p>
        </div>
      )}

      <FixedButtonContainer className="!bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          disabled={cancelReason.length < 5 || isLoading}
          onClick={handleCancel}
          className="w-full"
        >
          {isLoading ? '취소 처리중...' : '예약 취소하기'}
        </Button>
      </FixedButtonContainer>
    </div>
  );
};

export default ReservationCancelPage;
