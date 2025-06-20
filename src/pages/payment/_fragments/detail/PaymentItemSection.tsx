import { PaymentHistoryDetail } from '@/types/Payment';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import PaymentItemList from '../PaymentItemList';

interface PaymentItemSectionProps {
  payment: PaymentHistoryDetail;
  hideButton?: boolean;
  className?: string;
}

const PaymentItemSection = ({ payment, hideButton = false, className }: PaymentItemSectionProps) => {
  const navigate = useNavigate();
  const formattedDate = dayjs(payment.paidAt).format('YYYY.MM.DD');
  return (
    <section className={clsx('flex flex-col gap-4', className)} aria-label={`${formattedDate} 결제 내역`}>
      <header className="flex gap-2 items-center">
        <time dateTime={payment.paidAt.toISOString()} className="font-sb">
          {formattedDate}
        </time>
        <span className={clsx('font-m text-12px text-gray-500 bg-gray-50', 'rounded py-0.5 px-1.5')} role="status">
          {payment.type}
        </span>
      </header>
      <PaymentItemList
        payment={payment}
        onClickShowCancelHistory={
          !hideButton
            ? () => {
                navigate(`/payment/${payment.index}/cancel-detail`);
              }
            : undefined
        }
      />
    </section>
  );
};

export default PaymentItemSection;
