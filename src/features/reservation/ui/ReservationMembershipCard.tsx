import { formatAmount } from '@/features/reservation/lib/format.utils';
import { RadioButton } from '@/shared/ui/radio/RadioButton';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ReservationMembershipCardProps } from '@/features/reservation/ui/ReservationMembershipCard.types';

export const ReservationMembershipCard = ({ data, checked, onChange }: ReservationMembershipCardProps) => {
  const {
    mp_idx: id,
    branchName,
    serviceName,
    startDate,
    expireDate,
    remainAmount,
    totalAmount,
    type = 'standard'
  } = data;

  return (
    <label
      className={clsx(
        'w-full p-5 bg-white rounded-xl border flex flex-col cursor-pointer',
        checked ? 'border-primary' : 'border-gray-100'
      )}
    >
      <div className="flex items-center justify-between pb-3">
        <div className="px-[6px] py-[2px] bg-gray-100 rounded">
          <p className="text-gray-500 text-xs font-m">{branchName}</p>
        </div>
        <RadioButton value={id} checked={checked} onChange={onChange} />
      </div>

      <h3 className="text-gray-700 text-base font-sb mb-2 truncate">{serviceName}</h3>
      <div className="flex flex-col items-start gap-1.5">
        <p className="text-xs font-r text-gray-600">{formatDate(startDate, expireDate)}</p>
        <p className="text-xs font-r text-gray-600">{formatAmount(remainAmount, totalAmount, type)}</p>
      </div>
    </label>
  );
};

const formatDate = (startDate: string, expireDate: string) => {
  const fmt = 'YYYY.MM.DD';
  const parseFmt = 'YYYY-MM-DD HH:mm';

  const start = dayjs(startDate, parseFmt).format(fmt);
  const end = dayjs(expireDate, parseFmt).format(fmt);

  return `${start} - ${end}`;
};
