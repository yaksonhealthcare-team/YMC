import { PaymentHistoryDetail } from '../../../../types/Payment.ts';

const PaymentPointSection = ({ payment }: { payment: PaymentHistoryDetail }) => {
  const canceled = payment.status.includes('취소');

  return (
    <div className={'flex flex-col'}>
      {canceled && (
        <div className={'flex flex-col'}>
          <div className={'flex justify-between mt-3 items-center'}>
            <p className={'text-14px font-m text-gray-500'}>{'적립된 포인트'}</p>
            <p className={'text-14px font-sb text-primary'}>{`+${payment.point}P`}</p>
          </div>
          {payment.items.map((item) => (
            <div className={'flex justify-between mt-3 items-center'}>
              <p className={'text-14px font-m text-gray-500'}>{'주문 취소로 인한 포인트 반환'}</p>
              <p className={'text-14px font-sb text-success'}>{`-${item.cancel.refundPoint}P`}</p>
            </div>
          ))}
          <div className={'h-[1px] bg-gray-100 my-4'} />
        </div>
      )}
      <div className={'flex justify-between items-center'}>
        <p className={'font-m text-gray-700'}>{'총 적립된 포인트'}</p>
        <p className={'text-20px font-b text-gray-700'}>
          {`+${payment.point - payment.items.reduce((acc, curr) => acc + curr.cancel.refundPoint, 0)}P`}
        </p>
      </div>
    </div>
  );
};

export default PaymentPointSection;
