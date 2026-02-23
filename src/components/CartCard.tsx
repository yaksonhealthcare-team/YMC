import ClockIcon from '@/assets/icons/ClockIcon.svg?react';
import XCircleIcon from '@/shared/ui/icons/XCircleIcon';
import { Number } from '@/shared/ui/Number';
import { CartItemOption } from '@/entities/cart/model/Cart';
import { formatPriceWithUnit } from '@/shared/lib/utils/format';
import clsx from 'clsx';

interface CartCardProps {
  brand: string;
  branchType: string;
  title: string;
  duration: number;
  options: CartItemOption[];
  onCountChange: (cartId: string, newCount: number) => void;
  onDelete: () => void;
  onDeleteOption?: (cartIds: string[]) => void;
  className?: string;
  branchName?: string;
}

const CartCard = ({
  brand,
  branchType,
  title,
  duration,
  options,
  onCountChange,
  onDelete,
  onDeleteOption,
  className,
  branchName
}: CartCardProps) => {
  const branchText = branchType === '지점 회원권' && branchName ? branchName : branchType;

  return (
    <div className={clsx('p-5 bg-white rounded-[20px] border border-gray-100', className)}>
      <div className="flex justify-between items-start pb-1">
        <div className="w-full flex flex-col">
          <div className="w-full flex items-center justify-between mb-[12px]">
            <p className="flex items-center justify-center bg-gray-100 px-[6px] py-[2px] rounded-[4px]">
              <span className="text-gray-500 text-12px font-r">{branchText}</span>
            </p>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-[14px] text-primary" />
              <span className="text-gray-500 text-14px font-r">{duration}분 소요</span>
            </div>
          </div>
          <p className="text-gray-700 text-14px mb-[4px]">{brand}</p>
          <p className="text-gray-700 text-16px font-sb">{title}</p>
        </div>
      </div>

      {options
        .sort((lhs, rhs) => rhs.sessions - lhs.sessions)
        .map((option, idx) => {
          const count = option.items.reduce((prev, acc) => prev + acc.count, 0);
          return (
            <div key={idx}>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 text-16px font-m">{option.sessions}회</span>
                  <button onClick={() => onDeleteOption?.(option.items.flatMap((item) => item.cartId))}>
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex w-full items-center justify-between gap-4">
                  <Number
                    count={count}
                    minimumCount={1}
                    onClickMinus={() => {
                      onCountChange(option.items[0].cartId, Math.max(1, option.items[0].count - 1));
                    }}
                    onClickPlus={() => onCountChange(option.items[0].cartId, option.items[0].count + 1)}
                  />
                  <div className={'flex items-center gap-4'}>
                    <div>
                      <span className="text-gray-700 text-16px font-sb">
                        {formatPriceWithUnit(option.price * count)}
                      </span>
                    </div>
                    {option.originalPrice !== option.price && (
                      <span className="text-gray-300 text-14px font-r line-through">
                        {formatPriceWithUnit(option.originalPrice * count)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {idx < options.length - 1 && <div className="w-full h-[1px] bg-gray-100 my-4" />}
            </div>
          );
        })}

      <button onClick={onDelete} className="w-full py-2.5 mt-4 bg-gray-100 rounded-lg text-gray-700 text-14px font-sb">
        삭제하기
      </button>
    </div>
  );
};

export default CartCard;
