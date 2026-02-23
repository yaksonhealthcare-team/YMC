import ClockIcon from '@/assets/icons/ClockIcon.svg?react';
import XCircleIcon from '@/shared/ui/icons/XCircleIcon';
import { Number } from '@/shared/ui/Number';
import { CartItemOption } from '@/entities/cart/model/Cart';
import { formatPriceWithUnit } from '@/shared/lib/utils/format';

interface PaymentCardProps {
  brand: string;
  branchType: string;
  title: string;
  duration: number;
  options: CartItemOption[];
  onCountChange: (cartId: string, newCount: number) => void;
  onDelete: () => void;
  onDeleteOption?: (cartIds: string[]) => void;
  branchName?: string;
}

const PaymentCard = ({
  brand,
  branchType,
  title,
  duration,
  options,
  onCountChange,
  onDelete,
  onDeleteOption,
  branchName
}: PaymentCardProps) => {
  const branchText = branchType === '지점 회원권' && branchName ? branchName : branchType;

  return (
    <div className="p-5 bg-white rounded-[20px] border border-gray-100">
      <div className="flex flex-col gap-1.5">
        <p className="text-gray-700 text-16px font-sb">{title}</p>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-500 text-12px font-r">{duration}분 소요</span>
          <div className="w-[1px] h-3 bg-gray-200 mx-1.5" />
          <span className="text-gray-500 text-12px font-r">{brand}</span>
          <div className="w-[1px] h-3 bg-gray-200 mx-1.5" />
          <span className="text-gray-500 text-12px font-r">{branchText}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {options
          .sort((lhs, rhs) => rhs.sessions - lhs.sessions)
          .map((option, idx) => {
            const count = option.items.reduce((prev, acc) => prev + acc.count, 0);
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#212121] text-16px font-m">{option.sessions}회</span>
                  <button onClick={() => onDeleteOption?.(option.items.flatMap((item) => item.cartId))}>
                    <XCircleIcon className="w-5 h-5 text-[#9E9E9E]" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <Number
                    count={count}
                    minimumCount={1}
                    onClickMinus={() => {
                      onCountChange(option.items[0].cartId, Math.max(1, option.items[0].count - 1));
                    }}
                    onClickPlus={() => onCountChange(option.items[0].cartId, option.items[0].count + 1)}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[#212121] text-16px font-sb">
                        {formatPriceWithUnit(option.price * count)}
                      </span>
                    </div>
                    {option.originalPrice !== option.price && (
                      <span className="text-[#BDBDBD] text-14px font-r line-through">
                        {formatPriceWithUnit(option.originalPrice * count)}
                      </span>
                    )}
                  </div>
                </div>
                {idx < options.length - 1 && <div className="w-full h-[1px] bg-[#ECECEC] my-4" />}
              </div>
            );
          })}
      </div>

      {/* 삭제 버튼 */}
      <button onClick={onDelete} className="w-full h-10 mt-6 bg-[#ECECEC] rounded-lg text-[#212121] text-14px font-sb">
        삭제하기
      </button>
    </div>
  );
};

export default PaymentCard;
