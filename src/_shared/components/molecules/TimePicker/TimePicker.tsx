import { Button, Loading } from '@/_shared';
import clsx from 'clsx';
import { TimeButtonProps, TimePickerProps } from './TimePicker.types';

export const TimePicker = ({ times, selectedTime, isLoading = false, onClick }: TimePickerProps) => {
  const hasTimes = !!times.length;

  if (isLoading) {
    return <Loading className="min-h-56" />;
  }

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-4 gap-2">
        {hasTimes ? (
          times.map((slot, idx) => {
            const key = `${slot}-${idx}`;

            return (
              <TimeButton key={key} isSelected={slot === selectedTime?.time} onClick={() => onClick(slot)}>
                <p className={clsx('text-sm font-normal text-gray-700', slot === selectedTime?.time && 'text-white')}>
                  {slot}
                </p>
              </TimeButton>
            );
          })
        ) : (
          <div className="col-span-4 p-4 bg-[#f7f7f7] rounded-lg">
            <p className="text-sm text-center">선택 가능한 시간이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TimeButton = ({ children, onClick, isSelected }: TimeButtonProps) => {
  return (
    <Button
      className={clsx(
        'h-10 px-2.5 rounded-lg flex justify-center items-center whitespace-nowrap',
        isSelected ? 'bg-primary-300 border-gray-200 border-none' : 'bg-white border border-solid border-gray-200'
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
