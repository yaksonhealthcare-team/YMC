import PriceSummary, { PriceItem } from '@/components/PriceSummary';
import { PaymentCompleteState } from '@/types/Payment';
import { toNumber } from '@/utils/number';

interface PaymentSummaryProps {
  state: PaymentCompleteState;
  isVirtual: boolean;
}

const PaymentSummary = ({ state, isVirtual }: PaymentSummaryProps) => {
  const items: PriceItem[] = [
    {
      label: '상품 금액',
      amount: toNumber(state.amount_info.total_amount)
    }
  ];

  if (state.amount_info.discount_amount > 0) {
    items.push({
      label: '할인 금액',
      amount: toNumber(state.amount_info.discount_amount),
      type: 'success'
    });
  }

  if (toNumber(state.amount_info.point_amount) > 0) {
    items.push({
      label: '포인트 사용',
      amount: toNumber(state.amount_info.point_amount),
      type: 'success'
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sb text-16px text-gray-700 px-5 pt-5">결제 내역</p>
      <PriceSummary
        title=""
        items={items}
        total={{
          label: isVirtual ? '입금금액' : '최종결제금액',
          amount: toNumber(state.amount_info.payment_amount)
        }}
      />
      {isVirtual && <p className="self-end text-error font-sb text-14px px-5">결제미완료</p>}
      <div className="w-full h-[96px]" />
    </div>
  );
};

export default PaymentSummary;
