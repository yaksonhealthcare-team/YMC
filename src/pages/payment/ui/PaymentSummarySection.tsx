import PriceSummary from '@/widgets/price-summary/ui/PriceSummary';

interface PaymentSummarySectionProps {
  totalAmount: number;
  discountAmount: number;
  pointAmount: number;
  finalAmount: number;
}

const PaymentSummarySection = ({
  totalAmount,
  discountAmount,
  pointAmount,
  finalAmount
}: PaymentSummarySectionProps) => {
  return (
    <div className="border-b-8 border-gray-50">
      <PriceSummary
        items={[
          { label: '상품 금액', amount: totalAmount },
          { label: '상품할인금액', amount: discountAmount, type: 'success' },
          { label: '포인트 사용', amount: pointAmount, type: 'success' }
        ]}
        total={{
          label: '최종결제금액',
          amount: finalAmount
        }}
      />
    </div>
  );
};

export default PaymentSummarySection;
