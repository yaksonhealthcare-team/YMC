import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import clsx from 'clsx';
import { MembershipChip } from '@/widgets/membership-card/ui/MembershipChip';
import { MembershipCardProps } from './MembershipCard.types';

export const MembershipCard = ({ chips, title, content, date, onClick, onClickReservation }: MembershipCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleClickReservation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClickReservation?.();
  };

  return (
    <div
      className={clsx(
        'flex flex-col bg-white p-5 border border-gray-100 shadow-card rounded-[20px] gap-1.5',
        onClick && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {chips.map((chip, idx) => {
            const key = `${chip.type}-${idx}`;

            return <MembershipChip key={key} {...chip} />;
          })}
        </div>
        {onClick && (
          <button onClick={onClick} className="flex justify-self-end gap-0.5">
            <p className="font-r text-xs text-gray-500">이용내역</p>
            <CaretRightIcon className="w-3 h-3 mt-[1px]" />
          </button>
        )}
      </div>

      <p className="font-sb text-base text-gray-700 truncate">{title}</p>

      <div className="flex items-start">
        <div className="flex flex-1 flex-col gap-1.5">
          {date && <p className="font-r text-xs text-gray-600">{date}</p>}
          <p className="font-r text-xs text-gray-600">{content}</p>
        </div>
        {onClickReservation && <ReservationButton onClick={handleClickReservation} />}
      </div>
    </div>
  );
};

interface ReservationButtonProps {
  onClick: (e: React.MouseEvent) => void;
}
const ReservationButton = ({ onClick }: ReservationButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="self-end justify-self-end px-3 py-2 rounded-lg bg-primary active:bg-primary-500"
    >
      <p className="text-white font-sb text-sm ">예약하기</p>
    </button>
  );
};
