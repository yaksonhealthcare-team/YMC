import { fetchPoints } from '@/entities/point/api/points.api';
import { Button } from '@/shared/ui/button/Button';
import FixedButtonContainer from '@/shared/ui/button/FixedButtonContainer';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { usePayment } from '@/features/payment/lib/usePayment';
import { usePaymentHandlers } from '@/features/payment/lib/usePaymentHandlers';
import { usePaymentStore } from '@/features/payment/lib/usePaymentStore';
import { formatPriceWithUnit } from '@/shared/lib/utils/format';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentAgreementSection from './ui/PaymentAgreementSection';
import PaymentMethodSection from './ui/PaymentMethodSection';
import PaymentPointSection from './ui/PaymentPointSection';
import PaymentProductSection from './ui/PaymentProductSection';
import PaymentSummarySection from './ui/PaymentSummarySection';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { setHeader, setNavigation } = useLayout();
  const { items, points, setPaymentMethod } = usePaymentStore();
  const { handlePayment, calculateTotalAmount } = usePayment();
  const { handlePointChange, handleUseAllPoints, handleCountChange, handleDelete } = usePaymentHandlers();

  const [selectedPayment, setSelectedPayment] = useState<'card' | 'bank' | 'vbank'>('card');
  const [isAgreed, setIsAgreed] = useState(false);

  const { data: availablePoints = 0, isLoading: isPointsLoading } = useQuery({
    queryKey: ['points'],
    queryFn: fetchPoints,
    retry: false
  });

  const totalAmount = calculateTotalAmount(items);

  useEffect(() => {
    if (availablePoints > 0) {
      usePaymentStore.setState((state) => ({
        points: {
          ...state.points,
          availablePoints
        }
      }));
    }
  }, [availablePoints]);

  useEffect(() => {
    setHeader({
      display: true,
      title: '결제하기',
      left: 'back',
      onClickBack: () => navigate(-1),
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation, navigate]);

  if (isPointsLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  const handlePaymentMethodChange = (method: 'card' | 'bank' | 'vbank') => {
    setSelectedPayment(method);
    setPaymentMethod(method);
  };

  return (
    <div className="bg-white pb-[95px]">
      <PaymentProductSection items={items} onCountChange={handleCountChange} onDelete={handleDelete} />

      <PaymentPointSection
        availablePoints={points.availablePoints}
        usedPoints={points.usedPoints}
        onPointChange={handlePointChange}
        onUseAllPoints={handleUseAllPoints}
      />

      <PaymentMethodSection selectedPayment={selectedPayment} onPaymentMethodChange={handlePaymentMethodChange} />

      <PaymentSummarySection
        totalAmount={items.reduce((total, item) => total + item.price * item.amount, 0)}
        discountAmount={0}
        pointAmount={points.usedPoints}
        finalAmount={Math.max(
          items.reduce((total, item) => total + item.price * item.amount, 0) - points.usedPoints,
          0
        )}
      />

      <PaymentAgreementSection isAgreed={isAgreed} onAgreementChange={setIsAgreed} />

      <FixedButtonContainer className="bg-white">
        <Button variantType="primary" sizeType="l" onClick={handlePayment} disabled={!isAgreed} className="w-full">
          {formatPriceWithUnit(totalAmount)} 결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  );
};

export default PaymentPage;
