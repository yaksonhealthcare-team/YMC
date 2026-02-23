import { PaymentItem } from '@/entities/payment/model/Payment';
import { formatPriceWithUnit } from '@/shared/lib/utils/format';

interface PaymentItemCardProps {
  item: PaymentItem;
}

const PaymentItemCard = ({ item }: PaymentItemCardProps) => (
  <div className="p-5 bg-white rounded-[20px] border border-[#DDDDDD] flex flex-col gap-5">
    <div className="flex flex-col gap-3">
      <div className="text-primary text-14px font-m">결제완료</div>
      <div className="flex flex-col gap-1.5">
        <div className="text-gray-900 text-16px font-sb">{item.title}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-gray-900 text-14px font-r">{item.sessions}회</span>
          <span className="text-gray-900 text-14px font-b">{formatPriceWithUnit(item.price * item.amount)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.75586 6.54492V9.16409C1.75586 11.7833 2.80586 12.8333 5.42503 12.8333H8.56919C11.1884 12.8333 12.2384 11.7833 12.2384 9.16409V6.54492"
            stroke="#757575"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.99963 7.00033C8.06713 7.00033 8.85463 6.13116 8.74963 5.06366L8.36463 1.16699H5.64046L5.24963 5.06366C5.14463 6.13116 5.93213 7.00033 6.99963 7.00033Z"
            stroke="#757575"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.681 7.00033C11.8593 7.00033 12.7226 6.04366 12.606 4.87116L12.4426 3.26699C12.2326 1.75033 11.6493 1.16699 10.121 1.16699H8.3418L8.75013 5.25616C8.8493 6.21866 9.71846 7.00033 10.681 7.00033Z"
            stroke="#757575"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.29005 7.00033C4.25255 7.00033 5.12172 6.21866 5.21505 5.25616L5.34339 3.96699L5.62339 1.16699H3.84422C2.31589 1.16699 1.73255 1.75033 1.52255 3.26699L1.36505 4.87116C1.24839 6.04366 2.11172 7.00033 3.29005 7.00033Z"
            stroke="#757575"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.00033 9.91699C6.02616 9.91699 5.54199 10.4012 5.54199 11.3753V12.8337H8.45866V11.3753C8.45866 10.4012 7.97449 9.91699 7.00033 9.91699Z"
            stroke="#757575"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-gray-500 text-12px font-r">{item.brand}</span>
        <div className="w-[1px] h-3 bg-[#DDDDDD] rotate-90" />
        <span className="text-gray-500 text-12px font-r">{item.branchType}</span>
      </div>
    </div>
  </div>
);

export default PaymentItemCard;
