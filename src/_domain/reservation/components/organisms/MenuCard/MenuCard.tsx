import ClockIcon from '@/assets/icons/ClockIcon.svg?react';
import clsx from 'clsx';
import { MenuCardProps } from './MenuCard.types';

export const MenuCard = ({ item, type = 'standard' }: MenuCardProps) => {
  const { name, category, price, spentTime } = item;

  return (
    <div className={clsx('flex flex-col p-5 rounded-[20px] bg-white', 'shadow-[0px_2px_4px_0px_rgba(46,43,41,0.1)]')}>
      <div className="flex justify-between pb-3">
        <div className="rounded-[4px] px-[6px] py-[2px] bg-gray-100">
          <p className="text-12px font-m text-gray-500">{category}</p>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-[14px] h-[14px] text-primary" />
          <p className="text-sm font-r text-gray-500">약 {spentTime}분 소요</p>
        </div>
      </div>

      <div className="flex items-center justify-start pb-3 ">
        <p className="text-base font-sb text-gray-700 truncate">{name}</p>
      </div>

      <div className="flex items-center justify-end gap-1">
        <p className="text-base font-b text-gray-700">{price}원</p>
        <p className="text-xs font-r text-gray-700">{type === 'standard' ? '부터~' : '차감'}</p>
      </div>
    </div>
  );
};
