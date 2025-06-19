import { useNavigate, useParams } from 'react-router-dom';
import { usePaymentHistory } from '../../queries/usePaymentQueries.tsx';
import { useLayout } from '../../contexts/LayoutContext.tsx';
import { useEffect } from 'react';
import { Button } from '@components/Button.tsx';
import PaymentDescriptionSection from './_fragments/detail/PaymentDescriptionSection.tsx';
import PaymentPointSection from './_fragments/detail/PaymentPointSection.tsx';
import PaymentItemSection from './_fragments/detail/PaymentItemSection.tsx';
import PaymentCancelReasonSection from './_fragments/detail/PaymentCancelReasonSection.tsx';
import PaymentRefundDescriptionSection from './_fragments/detail/PaymentRefundDescriptionSection.tsx';
import LoadingIndicator from '@components/LoadingIndicator';

const PaymentHistoryDetailPage = () => {
  const { id } = useParams();
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const { data: payment, isLoading } = usePaymentHistory(id!);
  const canceled = payment?.status.includes('취소') || false;

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '결제 상세 내역',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, []);

  if (isLoading || !payment) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  const renderFooter = () => {
    if (payment.category === 'additional') {
      if (payment.items.length === 0 || !payment.items[0].reservationId) return null;

      return (
        <div className={'border-t border-gray-200 px-5 pt-3 pb-8'}>
          <Button className={'w-full'} onClick={() => navigate(`/reservation/${payment.items[0].reservationId}`)}>
            {'예약 내역 보기'}
          </Button>
        </div>
      );
    }

    if (canceled) {
      return null;
    }

    return (
      <div className={'border-t border-gray-200 px-5 pt-3 pb-8'}>
        {payment.isOfflinePayment && (
          <p className="text-center text-gray-500 mb-2 text-14px">현장결제 건은 앱에서 취소가 불가능합니다.</p>
        )}
        <Button
          className={'w-full'}
          onClick={() => navigate(`/payment/${payment.index}/cancel`)}
          disabled={payment.isOfflinePayment}
        >
          {'결제 취소하기'}
        </Button>
      </div>
    );
  };

  return (
    <div className={'h-full flex flex-col justify-between overflow-hidden'}>
      <div className={'flex flex-col overflow-scroll pb-8'}>
        <div className={'mt-6 px-5'}>
          <PaymentItemSection payment={payment} />
        </div>
        {payment.category === 'additional' && (
          <div className={'mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50'}>
            <p className={'text-14px text-gray-500 font-m'}>{'추가 관리 항목'}</p>
            <p className={'font-sb text-14px'}>{payment.items.map((item) => item.name).join(' / ')}</p>
          </div>
        )}
        {payment.category === 'additional' && canceled && (
          <div className={'mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50'}>
            <PaymentCancelReasonSection {...payment.items[0].cancel} />
          </div>
        )}
        <div className={'mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50'}>
          <PaymentDescriptionSection payment={payment} />
        </div>
        {payment.category === 'additional' && canceled && (
          <>
            <div className={'mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50'}>
              <PaymentRefundDescriptionSection payment={payment} />
            </div>
          </>
        )}
        <div className={'mt-6 pt-6 px-5 flex flex-col gap-3 border-t-8 border-gray-50'}>
          <PaymentPointSection payment={payment} />
        </div>
      </div>
      {renderFooter()}
    </div>
  );
};

export default PaymentHistoryDetailPage;
