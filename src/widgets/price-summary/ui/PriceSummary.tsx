import { formatPriceWithUnit } from '@/shared/lib/utils/format';
import { Divider } from '@mui/material';

export type PriceItemType = 'default' | 'success' | 'error';

export interface PriceItem {
  label: string;
  amount: number;
  type?: PriceItemType;
}

interface PriceSummaryProps {
  title?: string;
  items: PriceItem[];
  total: {
    label: string;
    amount: number;
  };
  className?: string;
}

const PriceSummary = ({ title = '결제 금액', items, total, className = '' }: PriceSummaryProps) => {
  return (
    <div className={`p-5 ${className}`}>
      {title && <h2 className="text-gray-700 font-sb text-16px mb-4">{title}</h2>}

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-500 text-14px font-m">{item.label}</span>
            <span
              className={`font-sb text-14px ${
                item.type === 'success' ? 'text-success' : item.type === 'error' ? 'text-error' : 'text-gray-700'
              }`}
            >
              {item.type === 'success' || item.type === 'error' ? '-' : ''}
              {formatPriceWithUnit(item.amount)}
            </span>
          </div>
        ))}
      </div>

      <Divider className="my-4" />

      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-16px font-m">{total.label}</span>
        <span className="text-gray-700 font-b text-20px">{formatPriceWithUnit(total.amount)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
