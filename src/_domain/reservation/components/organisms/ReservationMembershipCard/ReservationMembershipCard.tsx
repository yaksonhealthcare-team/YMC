import { RadioButton } from '@/_shared/components';
import { formatPriceKO } from '@/_shared/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ReservationMembershipCardProps } from './ReservationMembershipCard.types';

export const ReservationMembershipCard = ({ data, checked, onChange }: ReservationMembershipCardProps) => {
  const { id, branchName, serviceName, startDate, expireDate, remainAmount, totalAmount, type = 'standard' } = data;

  return (
    <label
      className={clsx(
        'w-full p-5 bg-white rounded-xl border flex flex-col cursor-pointer',
        checked ? 'border-primary' : 'border-gray-100'
      )}
    >
      <div className="flex items-center justify-between pb-3">
        <div className="px-[6px] py-[2px] bg-gray-100 rounded-[4px]">
          <p className="text-gray-500 text-xs font-m">{branchName}</p>
        </div>
        <RadioButton value={id} checked={checked} onChange={onChange} />
      </div>

      <h3 className="text-gray-700 text-base font-sb mb-2 truncate">{serviceName}</h3>
      <div className="flex items-center gap-2">
        <p className="text-xs font-r text-gray-600">{formatAmount(remainAmount, totalAmount, type)}</p>
        <div className="w-[2px] h-3 bg-gray-200" />
        <p className="text-xs font-r text-gray-600">{formatDate(startDate, expireDate)}</p>
      </div>
    </label>
  );
};

const formatAmount = (remainAmount: string, totalAmount: string, type: 'pre-paid' | 'standard') => {
  switch (type) {
    case 'pre-paid':
      return `${formatPriceKO(Number(remainAmount))}원 / ${formatPriceKO(Number(totalAmount))}원`;
    case 'standard':
      return `${remainAmount}회 / ${totalAmount}회`;
    default:
      return null;
  }
};

const formatDate = (startDate: string, expireDate: string) => {
  const fmt = 'YYYY.MM.DD';
  const parseFmt = 'YYYY-MM-DD HH:mm';

  const start = dayjs(startDate, parseFmt).format(fmt);
  const end = dayjs(expireDate, parseFmt).format(fmt);

  return `${start} - ${end}`;
};
