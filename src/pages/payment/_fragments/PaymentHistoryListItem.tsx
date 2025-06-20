import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import { Button } from '@/components/Button';
import { useOverlay } from '@/contexts/ModalContext';
import { usePointsEarn } from '@/queries/usePointQueries';
import { PaymentHistory } from '@/types/Payment';
import { formatDate } from '@/utils/date';
import { formatPoint } from '@/utils/format';
import PaymentHistoryItemCard from './PaymentItemList';

const PointCard = ({ point }: { point: number }) => (
  <div className={'bg-red-50 rounded-xl p-4'}>
    <p className={'text-14px font-m text-primary'}>{`+${formatPoint(point)} 적립되었습니다.`}</p>
  </div>
);

const ReceivePointBottomSheet = ({
  point,
  onClose,
  isSuccess = true,
  errorMessage = ''
}: {
  point: number;
  onClose: () => void;
  isSuccess?: boolean;
  errorMessage?: string;
}) => {
  return (
    <div className={'flex flex-col items-center'}>
      {isSuccess ? (
        <>
          <div className={'flex items-center gap-2 mt-5'}>
            <span className={'bg-primary rounded-full font-b text-white w-6 h-6'}>P</span>
            <p className={'text-20px font-b text-primary'}>{`+${formatPoint(point)}`}</p>
          </div>
          <p className={'mt-4'}>{'포인트가 적립되었습니다.'}</p>
        </>
      ) : (
        <>
          <p className={'text-18px font-sb text-red-500 mt-5'}>{'포인트 적립 실패'}</p>
          <p className={'mt-4 text-center'}>{errorMessage || '포인트 적립에 실패했습니다.'}</p>
        </>
      )}
      <div className={'border-t border-gray-50 pt-3 pb-5 px-5 mt-10 w-full'}>
        <Button className={'w-full'} variantType={'primary'} onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  );
};

const PaymentHistoryListItem = ({ payment }: { payment: PaymentHistory }) => {
  const { openBottomSheet, closeOverlay } = useOverlay();
  const { mutateAsync: earnPoints } = usePointsEarn();

  const handleReceivePoint = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 중단
    try {
      const response = await earnPoints(payment.index);

      if (response?.resultCode === '00') {
        // 성공 케이스
        openBottomSheet(<ReceivePointBottomSheet point={payment.point} onClose={closeOverlay} isSuccess={true} />);
      } else {
        // API 응답은 왔으나 resultCode가 00이 아닌 경우
        const errorMessage = response?.resultMessage || '포인트 적립에 실패했습니다.';
        openBottomSheet(
          <ReceivePointBottomSheet
            point={payment.point}
            onClose={closeOverlay}
            isSuccess={false}
            errorMessage={errorMessage}
          />
        );
      }
    } catch {
      // 네트워크 오류 등 예외 발생
      const errorMessage = '포인트 적립 중 오류가 발생했습니다.';
      openBottomSheet(
        <ReceivePointBottomSheet
          point={payment.point}
          onClose={closeOverlay}
          isSuccess={false}
          errorMessage={errorMessage}
        />
      );
    }
  };

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex justify-between items-center'}>
        <div className={'flex gap-2 items-center'}>
          <p className={'font-sb'}>{formatDate(payment.paidAt, 'YYYY.MM.DD')}</p>
          <span className={'font-m text-12px text-gray-500 bg-gray-50 rounded py-0.5 px-1.5'}>{payment.type}</span>
        </div>
        <CaretRightIcon className="w-4 h-4" />
      </div>
      {payment.pointStatus === 'done' && <PointCard point={payment.point} />}
      <PaymentHistoryItemCard payment={payment} />
      {payment.pointStatus === 'yet' &&
        !payment.status.includes('취소') &&
        payment.type.includes('현장') &&
        payment.isPointAvailable && (
          <Button variantType={'gray'} className={'h-10'} onClick={handleReceivePoint}>
            <p className={'text-14px font-sb'}>{'포인트 받기'}</p>
          </Button>
        )}
    </div>
  );
};

export default PaymentHistoryListItem;
